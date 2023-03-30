import { Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable,from,switchMap, catchError, map, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { UserEntity } from './interface/user.entity';
import { User } from './interface/user.interface';
import { AuthService } from 'src/auth/auth.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';



@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly authService: AuthService
    ) { }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                return users.map((user: User) => {
                    const { password, ...result } = user;
                    return result;
                });
            }
            )
        );
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOne(
            {
                where: {
                    id: id
            
                }
            }
        )).pipe(
            map((user: User) => {
                const { password, ...result } = user;
                return result;
            }
            )
        );

        
    }


    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const { password, ...result } = user;
                        return user                        
                    }),

                    catchError(err => throwError(err) )
                    
                );


            }
            )
        );

        
        

    }   

    delete (id: number): Observable<any> {
        return from(this.userRepository.delete(id)).pipe(  
            .map((user: User) => {
                const { password, ...result } = user;
                return result;
            }
            )
            ,
            catchError(err => throwError(err) )
        );

    }

    update(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user)).pipe(
            .map((user: User) => {
                const { password, ...result } = user;
                return result;
            }
            )
            ,
            catchError(err => throwError(err) )
        );

    }





}
