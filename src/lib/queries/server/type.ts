export interface ErrorResponse {
  success: false;
  error: {
    code:
      | 'VALIDATION_ERROR'
      | 'UNAUTHORIZED'
      | 'FORBIDDEN'
      | 'NOT_FOUND'
      | 'DUPLICATE_RECORD'
      | 'INTERNAL_ERROR';
    message: string;
    details?: Record<string, unknown>;
  };
}
