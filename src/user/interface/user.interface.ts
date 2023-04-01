export interface User{
  
    id: number;
    name?: string;
    username :string;
    password?: string;
    email: string;
    role?: UserRole;
      
}

export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',    
    EDITOR = 'editor',
    USER = 'user'
}