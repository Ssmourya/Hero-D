// Not found middleware
const notFound = (req, res, next) => {
  console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(`Error occurred: ${err.message}`);
  console.error(`Request: ${req.method} ${req.originalUrl}`);
  console.error(`Stack: ${err.stack}`);

  // Determine status code
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;

  // Set status code
  res.status(statusCode);

  // Send error response
  res.json({
    error: true,
    statusCode,
    message: err.message,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
