export const hasValidationErrors = (
    error: unknown
): error is { body: { errors: Record<string, unknown> } } =>
    typeof error === 'object' &&
    error !== null &&
    'body' in error &&
    typeof error.body === 'object' &&
    error.body !== null &&
    'errors' in error.body &&
    typeof error.body.errors === 'object' &&
    error.body.errors !== null &&
    Object.keys(error.body.errors).length > 0;
