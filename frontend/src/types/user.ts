export default interface User {
  userId: string;
  userName: string;
  email: string;
  role: "1" | "2" | "3"; // 1 = User, 2 = Admin, 3 = SuperAdmin
  createdAt: string;
}
