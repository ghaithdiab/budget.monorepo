export const  AuthService = {
  async getAllUsers():Promise<any>{
    const users = await fetch('http://localhost:3001/users');
    console.log(users)
    return users.json();
  }
}