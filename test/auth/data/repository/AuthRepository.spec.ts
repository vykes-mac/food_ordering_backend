import { expect } from 'chai'
import dotenv from 'dotenv'
import { beforeEach } from 'mocha'
import mongoose from 'mongoose'
import AuthRepository from '../../../../src/auth/data/repository/AuthRepository'

dotenv.config()

describe('AuthRepository', () => {
  let client: mongoose.Mongoose
  let sut: AuthRepository

  beforeEach(() => {
    client = new mongoose.Mongoose()
    const connectionStr = encodeURI(process.env.TEST_DB as string)
    client.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    sut = new AuthRepository(client)
  })

  afterEach(() => {
    client.disconnect()
  })

  it('should return user id when added to db', async () => {
    //arrange
    const user = {
      name: 'John Flyn',
      email: 'lyn@mail.com',
      password: 'pass232',
      type: 'email',
    }

    //act
    const result = await sut
      .add(user.name, user.email, user.type, user.password)
      .catch(() => null)
    //assert
    expect(result).to.not.be.empty
  })
})
