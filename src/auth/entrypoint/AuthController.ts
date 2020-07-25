import * as express from 'express'
import ITokenService from '../services/ITokenService'
import SignInUseCase from '../usecases/SignInUseCase'
import SignUpUseCase from '../usecases/SignUpUseCase'

export default class AuthController {
  private readonly signInUseCase: SignInUseCase
  private readonly signUpUseCase: SignUpUseCase
  private readonly tokenService: ITokenService

  constructor(
    signInUseCase: SignInUseCase,
    signupUseCase: SignUpUseCase,
    tokenService: ITokenService
  ) {
    this.signInUseCase = signInUseCase
    this.tokenService = tokenService
    this.signUpUseCase = signupUseCase
  }

  public async signin(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body
      return this.signInUseCase
        .execute(email, password)
        .then((id: string) =>
          res.status(200).json({ auth_token: this.tokenService.encode(id) })
        )
        .catch((err: Error) => res.status(404).json({ error: err.message }))
    } catch (err) {
      return res.status(400).json({ error: err })
    }
  }

  public async signup(req: express.Request, res: express.Response) {
    try {
      const { name, email, password, auth_type } = req.body
      return this.signUpUseCase
        .execute(name, auth_type, email, password)
        .then((id: string) =>
          res.status(200).json({ auth_token: this.tokenService.encode(id) })
        )
        .catch((err: Error) => res.status(404).json({ error: err.message }))
    } catch (err) {
      return res.status(400).json({ error: err })
    }
  }
}
