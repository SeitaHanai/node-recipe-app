/**
 * Wraps an async route handler and forwards any unhandled errors to Express's
 * next() error-handling middleware, removing the need for per-route try-catch blocks.
 *
 * @param {Function} fn - An async Express route handler (req, res, next) => Promise
 * @returns {Function} A route handler that catches rejected promises and calls next(err)
 */
const errorHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = errorHandler
