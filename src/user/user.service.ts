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
                users.map(user => {
                    const { password, ...result } = user;
                    return result;
                });
                return users;
            }
            )
        );
    }

    findOne(id: number): Observable<any> {
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
                        return result                        
                    }),

                    catchError(err => throwError(err) )
                    
                );


            }
            )
        );

        
        

    }   

    delete (id: number): Observable<any> {
        return from(this.userRepository.delete(id))
           

    }

    update(id: number, user: User): Observable<any> {
       delete user.password;
       delete user.password;

        return from(this.userRepository.update(id, user));

    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => this.authService.generateJwt(user).pipe(
                map((jwt: string) => jwt)
            ))
        )
                

    }

    validateUser(email:string , password:string): Observable<User> {
        return  this.findbyEmail(email).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, ...result } = user;
                        return result;
                    } else {
                        throw new HttpException('Invalid credentials', 401);
                    }
                }
                )
            ))
        )

    }

    findbyEmail(email: string): Observable<User> {
        return from(this.userRepository.findOne(
            {
                where: {
                    email: email
            
                }
            }
        ))

    }






}
