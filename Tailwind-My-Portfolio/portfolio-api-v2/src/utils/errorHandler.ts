import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

/**
 * Handles API errors and sends appropriate response
 * @param res Express response object
 * @param error Error object
 * @param statusCode HTTP status code
 */
export const handleError = (res: Response, error: unknown, statusCode = 500): void => {
  const err = error as Error;
  const errorResponse: ErrorResponse = {
    message: statusCode === 500 ? 'Server Error' : err.message || 'Something went wrong'
  };
  
  // Include error details in development environment
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error = err.message;
    errorResponse.stack = err.stack;
  }
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Handles async route functions to avoid try/catch blocks
 * @param fn Async function to wrap
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
}; 