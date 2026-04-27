export interface RegisterDTO {
  email:     string;
  password:  string;
  firstName: string;
  lastName:  string;
  role?:     string;
}

export interface LoginDTO {
  email:    string;
  password: string;
}
