import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';

// import { EPermission } from '../path-with-your-enum-values';
// import { JWTRequestPayload } from '../request-payload-type';
import { AtGuard } from './at-guard';
import { Reflector } from '@nestjs/core';

export const PermissionGuard = (permission: string): Type<CanActivate> => {
  
  class PermissionGuardMixin extends AtGuard {
    constructor(protected reflector: Reflector) {
      super(reflector);
    }
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const roles = this.reflector?.get<string[]>('roles', context.getHandler());
      const request = context.switchToHttp().getRequest<any>();
      //   console.log(request);
      const user = request.user;
    
     
      if (!user || !roles) {
        return false;
      }

      
      return roles.includes(permission);
   
    }
  }

  return mixin(PermissionGuardMixin);
};