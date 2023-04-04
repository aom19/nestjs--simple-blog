import { UserRole } from "./user.entity";

export interface User{
  
    id: number;
    name?: string;
    username :string;
    password?: string;
    email: string;
    role?: UserRole;
    profileImage?: string;
      
}

