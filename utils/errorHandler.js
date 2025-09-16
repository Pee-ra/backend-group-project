// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle MongoDB cast errors
const handleCastErrorDB = (err) => {
  const message = `ไม่พบข้อมูลที่ ID: ${err.value}`;
  return new AppError(message, 400);
};

// Handle MongoDB duplicate fields
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyPattern)[0];
  let message = '';
  
  switch (field) {
    case 'email':
      message = 'อีเมลนี้ถูกใช้งานแล้ว';
      break;
    case 'phone':
      message = 'เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว';
      break;
    case 'orderNumber':
      message = 'เลขที่ออเดอร์นี้ถูกใช้งานแล้ว';
      break;
    default:
      message = `${field} นี้ถูกใช้งานแล้ว`;
  }
  
  return new AppError(message, 400);
};

// Handle MongoDB validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `ข้อมูลไม่ถูกต้อง: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () =>
  new AppError('Token ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่', 401);

const handleJWTExpiredError = () =>
  new AppError('Token หมดอายุ กรุณาเข้าสู่ระบบใหม่', 401);

// Send error in development
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// Send error in production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในระบบ'
    });
  }
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Async error catcher
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export { AppError, globalErrorHandler, catchAsync };