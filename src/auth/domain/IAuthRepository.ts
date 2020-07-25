import User from './User'

export default interface IAuthRepository {
  find(email: string): Promise<User>
  add(
    name: string,
    email: string,
    type: string,
    passwordHash?: string
  ): Promise<string>
}
