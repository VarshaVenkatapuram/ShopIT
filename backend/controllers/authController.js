import { compare } from "bcrypt";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendEmail from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";
import {upload_file,delete_file} from '../utils/cloudinary.js';


//register user => /api/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 200, res);
});

//Login user => /api/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  //Find user in the database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  //check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

//logout user => /api/logout

export const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged Out",
  });
});

//upload user avatar => /api/me/upload_avatar

export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {

  

  if (req?.user?.avatar?.public_id) {
    await delete_file(req.user.avatar.public_id);
  }


  const avartarResponse =await upload_file(req.body.avatar,"shopit/avatars");

  
  
  const user=await User.findByIdAndUpdate(req?.user?._id,{
    avatar:avartarResponse,
  });

  res.status(200).json({
    message: "Logged Out",
  });
});

//Forgot password =>/api/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  //Find user in database
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }
  //get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  //create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;


  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIT Password Recovery",
      message,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }

  res.status(200).json({
    message: `Email sent successfully to: ${user.email}`,
  });
});

//Reset password => /api/password/reset/:token
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetToken = req.params.token;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords does not match", 400));
  }

  //set new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

//Get current user profile => /api/me

export const getUserProfile=catchAsyncErrors(async (req,res,next)=>{
  const user= await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
})
//update password => /api/password/update

export const updatePassword=catchAsyncErrors(async (req,res,next)=>{
  const user=await User.findById(req?.user?._id).select("+password");
  

  //check the previous user password
  const isPasswordMatched=await user.comparePassword(req.body.oldPassword);

  if(!isPasswordMatched)
  {
    return next(new ErrorHandler("Old Password is incorrect",400));
  }

  user.password=req.body.password;
  user.save();

  res.status(200).json({
    success:true,
  })

});

//update User Profile => /api/update
export const updateProfile=catchAsyncErrors(async(req,res,next)=>{

  const newData={
    name:req.body.name,
    email:req.body.email
  }

  const user=await User.findByIdAndUpdate(req.user._id,newData,{new:true});
  console.log("user",user);

  res.status(200).json({
    user,
  })
});

//Get all Users - ADMIN => /api/admin/users
export const allUsers=catchAsyncErrors(async(req,res,next)=>{
  const users=await User.find();
  

  res.status(200).json({
    NumberOfUsers :users.length,
    users,
  });
});

//Get User Details -ADMIN => /api/admin/users/:id
export const getUserDetails=catchAsyncErrors(async(req,res,next)=>{
  const id = req.params.id.trim();
  const user=await User.findById(id);

  if(!user)
  {
    return next(new ErrorHandler(`User not found with id : ${id}`,404));
  }
  res.status(200).json({
    user,
  });
});

//Update User Details - ADMIN => /api/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, role } = req.body;
  const userId = req.params.id.trim();

  // Check if another user already has the same email
  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser._id.toString() !== userId) {
    return next(new ErrorHandler("Email already in use", 400));
  }

  const newUserData = {
    name,
    email,
    role,
  };

  const user = await User.findByIdAndUpdate(userId, newUserData, { new: true });

  if (!user) {
    return next(new ErrorHandler(`User not found with id: ${userId}`, 404));
  }

  res.status(200).json({
    user,
  });
});


//Delete User - ADMIN => /api/admin/users/:id

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id.trim();
  const user = await User.findById(id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with this ID: ${id}`, 404)
    );
  }

  // TODO: Avatar deletion logic if needed
  if(user?.avatar?.public_id)
  {
    await delete_file(user?.avatar?.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `User with ID ${id} deleted successfully`,
  });
});
