const logger = require('./logger');

function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    body: req.body
  });
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Internal server error'
  });
}

module.exports = errorHandler;
