import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserIsUser implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { user } = request.user;
    const id = request.params.id;

    return Number(user.id) === Number(id);
  }
}
