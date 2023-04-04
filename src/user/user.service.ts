import { Injectable, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable,from,switchMap, catchError, map, throwError } from 'rxjs';
import { Like, Repository } from 'typeorm';
import { UserEntity } from './interface/user.entity';
import { User } from './interface/user.interface';
import { AuthService } from 'src/auth/auth.service';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';


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
                    delete user.password;
                    return user;
                });
               
                return users;
            })
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
                newUser.role = user.role;
                
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

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) => {
                usersPageable.items.forEach(function (v) {delete v.password});
                return usersPageable;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>>{
       
        return from(this.userRepository.findAndCount({
            skip: Number(options.page) * Number(options.limit) || 0,
            take: Number(options.limit) || 10,
            order: {id: "ASC"},
            select: ['id', 'name', 'username', 'email', 'role'],
            where: [
                { username: Like(`%${user.username}%`)}
            ]
            
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<User> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: users.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.limit))
                    }
                };              
                return usersPageable;
            })
        )
    }




}
