import { PostgresError } from 'pg-error-enum';
import { HttpStatus } from '@nestjs/common';

export const generateDBError = (error) => {
  switch (error.code) {
    case PostgresError.UNIQUE_VIOLATION:
      return {
        message: 'Sorry please add all the field as unique value',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    default:
      console.log(error);
      return {
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
  }
};
