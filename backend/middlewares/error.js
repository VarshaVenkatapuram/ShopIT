import ErrorHandler from "../utils/errorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  };

  // Handle Invalid Mongoose ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    error = new ErrorHandler(message, 400);
  }


  // Handle Mongoose Duplicstr Key Error
  if (err.code === 11000) {
  const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
  error = new ErrorHandler(message, 400);
}


  // Handle wrong JWT Error
  if (err.name === "jsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try Again!!!`;
    error = new ErrorHandler(message, 400);
  }

  //Handle expired JWT Error
  // Handle Mongoose Duplicstr Key Error
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired. Try Again!!!`;
    error = new ErrorHandler(message, 404);
  }

  // Handle Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");
    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err.stack,
    });
  } else {
    // PRODUCTION
    res.status(error.statusCode).json({
      message: error.message, // ✅ Use actual error message
    });
  }
};

export default errorMiddleware;
