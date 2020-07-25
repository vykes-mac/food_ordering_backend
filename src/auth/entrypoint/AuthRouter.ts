import * as express from 'express'
import IAuthRepository from '../domain/IAuthRepository'
import {
  signinValidationRules,
  signupValidationRules,
} from '../helpers/Validators'
import IPasswordService from '../services/IPasswordService'
import ITokenService from '../services/ITokenService'
import SignInUseCase from '../usecases/SignInUseCase'
import SignUpUseCase from '../usecases/SignUpUseCase'
import { validate } from './../helpers/Validators'
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
    router.post(
      '/signin',
      signinValidationRules(),
      validate,
      (req: express.Request, res: express.Response) =>
        controller.signin(req, res)
    )
    router.post(
      '/signup',
      signupValidationRules(),
      validate,
      (req: express.Request, res: express.Response) =>
        controller.signup(req, res)
    )
    return router
  }

  private static composeController(
    authRepository: IAuthRepository,
    tokenService: ITokenService,
    passwordService: IPasswordService
  ): AuthController {
    const signinUseCase = new SignInUseCase(authRepository, passwordService)
    const signupUseCase = new SignUpUseCase(authRepository, passwordService)
    const controller = new AuthController(
      signinUseCase,
      signupUseCase,
      tokenService
    )
    return controller
  }
}
