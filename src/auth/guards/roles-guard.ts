import { CanActivate, ExecutionContext, Inject, Injectable, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserService } from "src/user/user.service";






@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        @Inject(forwardRef (() => UserService))
        private userService: UserService,

        private reflector: Reflector
        
        ) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        console.log(request.user)
        const user = request.user;
        const hasRole = () => user.roles.some((role) => roles.includes(role));
        return user && user.roles && hasRole();
    }

}