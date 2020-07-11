import * as express from 'express'
import IAuthRepository from '../domain/IAuthRepository'
import IPasswordService from '../services/IPasswordService'
import ITokenService from '../services/ITokenService'
import SignInUseCase from '../usecases/SignInUseCase'
import AuthController from './AuthController'

export default class AuthRouter {
  public static configure(
    authRepository: IAuthRepository,
    tokenService: ITokenService,
    passwordService: IPasswordService
  ): express.Router {
    const router = express.Router()
    let controller = AuthRouter.composeController(
      authRepository,
      tokenService,
      passwordService
    )
    router.post('/signin', (req, res) => controller.signin(req, res))
    return router
  }

  private static composeController(
    authRepository: IAuthRepository,
    tokenService: ITokenService,
    passwordService: IPasswordService
  ): AuthController {
    const signinUseCase = new SignInUseCase(authRepository, passwordService)
    const controller = new AuthController(signinUseCase, tokenService)
    return controller
  }
}
