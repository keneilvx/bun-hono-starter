import type { Context } from 'hono';
import { StatusCodes } from '../Data/Enums/StatusCodes';

// Response data interfaces
export interface SuccessResponseData<T> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ErrorResponseData {
  success: false;
  error: string;
  details?: Record<string, unknown>;
}

// Options interfaces
export interface SuccessOptions {
  statusCode?: StatusCodes;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface ErrorOptions {
  statusCode?: StatusCodes;
  details?: Record<string, unknown>;
}

// SuccessResponse overloads and implementation
export function SuccessResponse<T>(
  c: Context,
  data: T,
  options?: SuccessOptions
): Response;

export function SuccessResponse<T>(
  c: Context,
  data: T,
  statusCode?: StatusCodes
): Response;

export function SuccessResponse<T>(
  c: Context,
  data: T,
  optionsOrStatus: StatusCodes | SuccessOptions = StatusCodes.OK
): Response {
  const isOptions = typeof optionsOrStatus === 'object';
  const statusCode = isOptions 
    ? (optionsOrStatus.statusCode ?? StatusCodes.OK)
    : optionsOrStatus;
  const message = isOptions ? optionsOrStatus.message : undefined;
  const meta = isOptions ? optionsOrStatus.meta : undefined;

  const response: SuccessResponseData<T> = {
    success: true,
    data,
    ...(message && { message }),
    ...(meta && { meta }),
  };

  return c.json(response, statusCode);
}

// ErrorResponse overloads and implementation
export function ErrorResponse(
  c: Context,
  message: string,
  options?: ErrorOptions
): Response;

export function ErrorResponse(
  c: Context,
  message: string,
  statusCode?: StatusCodes
): Response;

export function ErrorResponse(
  c: Context,
  message: string,
  optionsOrStatus: StatusCodes | ErrorOptions = StatusCodes.INTERNAL_SERVER_ERROR
): Response {
  const isOptions = typeof optionsOrStatus === 'object';
  const statusCode = isOptions
    ? (optionsOrStatus.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR)
    : optionsOrStatus;
  const details = isOptions ? optionsOrStatus.details : undefined;

  const response: ErrorResponseData = {
    success: false,
    error: message,
    ...(details && { details }),
  };

  return c.json(response, statusCode);
}