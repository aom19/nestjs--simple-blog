import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';


export enum UserRole {
  ADMIN = 'admin' ,
  User = 'user',
}


@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ nullable: true})
  profileImage: string;

  @Column(  { type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;


  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }






}