import { ValidationError } from "yup";

type ErrorObject = {
  [field: string]: string[];
};
/**
 * Convert yup error into an error object where the keys are the fields and the values are the errors for that field
 * @param {ValidationError} err The yup error to convert
 * @returns {ErrorObject} The error object
 */

export const mapperYupErrorsToErrorMessages = (
  err: ValidationError
): ErrorObject => {
  const errorObject: ErrorObject = {};

  err.inner.forEach((x) => {
    if (x.path !== undefined) {
      errorObject[x.path] = x.errors;
    }
  });

  return errorObject;
};
