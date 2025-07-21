import express from 'express';
import {registerUser,loginUser,logoutUser,forgotPassword,resetPassword,getUserProfile,updatePassword,updateProfile,allUsers,getUserDetails,updateUser,deleteUser, uploadAvatar} from '../controllers/authController.js';
import {authorizeRoles, isAuthenticatedUser} from '../middlewares/auth.js';
const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout",logoutUser);

router.post("/password/forgot",forgotPassword);
router.put("/password/reset/:token",resetPassword);

router.get("/me",isAuthenticatedUser,getUserProfile);
router.put("/me/update",isAuthenticatedUser,updateProfile)
router.put("/me/upload_avatar",isAuthenticatedUser,uploadAvatar)
router.put("/me/password/update",isAuthenticatedUser,updatePassword)

router.get("/admin/users",isAuthenticatedUser,authorizeRoles('admin'),allUsers);


router
.route("/admin/users/:id")
.get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser);
export default router;