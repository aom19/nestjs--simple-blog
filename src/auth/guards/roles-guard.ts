

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    //         if (!roles) {
    //             return true;
    //         }
    const request = context.switchToHttp().getRequest<any>();
    //   console.log(request);
    const user = request.user;
    console.log('user')
    console.log(user)
    return roles.some((role) => user?.roles?.includes(role));
  }
}


// import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { UserService } from "../../user/user.service"
// import { Observable } from "rxjs";
// import { User } from "src/user/interface/user.interface";
// import { map } from "rxjs/operators";
// import { hasRoles } from "src/auth/decorator/role.decorator";


// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(
//         private reflector: Reflector,

//         @Inject(forwardRef(() => UserService))
//         private userService: UserService
//     ) { }

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const roles = this.reflector.get<string[]>('roles', context.getHandler());
//         if (!roles) {
//             return true;
//         }
//         console.log(roles)

//         const request = context.switchToHttp().getRequest();
//         const user: User = request.user;
//         console.log(user)
       

//         return this.userService.findOne(user?.id).pipe(
//             map((user: User) => {
//                 const hasRole = () => roles.indexOf(user.role) > -1;
//                 let hasPermission: boolean = false;

//                 if (hasRole()) {
//                     hasPermission = true;
//                 };
//                 return user && hasPermission;
//             })
//         )
//     }
// }