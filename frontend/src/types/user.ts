export interface User {
  userId: string;
  userName: string;
  email: string;
  role: "User" | "Admin" | "SuperAdmin";
}
