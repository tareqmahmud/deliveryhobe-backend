import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { UserDto } from '../users/dto/user.dto';

interface ClassConstructor {
  // eslint-disable-next-line @typescript-eslint/ban-types
  new (...args: any[]): {};
}

export const UserSerializer = () => {
  return UseInterceptors(new UserSerializeInterceptor(UserDto));
};

/**
 * Interceptor to remove some private response data like password, token, etc based on custom DTO
 */
export class UserSerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // This portion will call before handle request

    return next.handle().pipe(
      map((data: any) => {
        // This portion will cal before deliver response
        return plainToClass(this.dto, data, {
          exposeUnsetFields: true,
        });
      }),
    );
  }
}
