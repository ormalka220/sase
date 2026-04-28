class AppError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'FORBIDDEN')
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400, 'VALIDATION_ERROR')
    this.details = details
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT')
  }
}

function errorHandler(err, _req, res, _next) {
  if (err.isOperational) {
    const body = { error: err.message, code: err.code }
    if (err.details) body.details = err.details
    return res.status(err.statusCode).json(body)
  }

  // Unexpected errors – don't leak details in production
  console.error('[Unhandled Error]', err)
  return res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' })
}

module.exports = { AppError, NotFoundError, ForbiddenError, ValidationError, ConflictError, errorHandler }
