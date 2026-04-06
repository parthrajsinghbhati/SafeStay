import { Role } from '@prisma/client';

export interface RegisterDTO {
  email:     string;
  password:  string;
  firstName: string;
  lastName:  string;
  role?:     Role;
}

export interface LoginDTO {
  email:    string;
  password: string;
}
