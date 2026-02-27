export interface User {
  userId: string;
  userName: string;
  role: "User" | "Admin" | "SuperAdmin";
  email: string;
  password: string;
}
