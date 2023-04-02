import { Inject, Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { JwtAuthGuard } from './guards/jwt-guard';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';


@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '600s' },
            }),
            
          


        }),
        PassportModule,
      

    ],
    providers: [AuthService,RolesGuard,JwtStrategy,JwtAuthGuard],
    exports: [AuthService]
    
})
export class AuthModule {}
