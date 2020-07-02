import { Mongoose } from 'mongoose'
import IAuthRepository from '../../domain/IAuthRepository'
import User from '../../domain/User'
import { UserModel, UserSchema } from './../models/UserModel'

export default class AuthRepository implements IAuthRepository {
  constructor(private readonly client: Mongoose) {}

  public async find(email: string): Promise<User> {
    const users = this.client.model<UserModel>('User', UserSchema)

    const user = await users.findOne({ email: email })

    if (!user) return Promise.reject('User not found')

    return new User(user.id, user.name, user.email, user.password, user.type)
  }

  public async add(
    name: string,
    email: string,
    passwordHash: string,
    type: string
  ): Promise<string> {
    const userModel = this.client.model<UserModel>('User', UserSchema)
    const savedUser = await userModel.create({
      type: type,
      name: name,
      email: email,
      password: passwordHash,
    })

    return savedUser.id
  }
}
