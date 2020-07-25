import mongoose from 'mongoose'
import AuthRepository from './auth/data/repository/AuthRepository'
import BcryptPasswordService from './auth/data/services/BcryptPasswordService'
import JwtTokenService from './auth/data/services/JwtTokenService'
import AuthRouter from './auth/entrypoint/AuthRouter'
export default class CompositionRoot {
  private static client: mongoose.Mongoose

  public static configure() {
    this.client = new mongoose.Mongoose()
    const connectionStr = encodeURI(process.env.TEST_DB as string)
    this.client.connect(connectionStr, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }

  public static authRouter() {
    const repository = new AuthRepository(this.client)
    const tokenService = new JwtTokenService(process.env.PRIVATE_KEY as string)
    const passwordService = new BcryptPasswordService()

    return AuthRouter.configure(repository, tokenService, passwordService)
  }
}
