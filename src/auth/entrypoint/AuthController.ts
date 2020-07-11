import * as express from 'express'
import ITokenService from '../services/ITokenService'
import SignInUseCase from '../usecases/SignInUseCase'

export default class AuthController {
  private readonly signInUseCase: SignInUseCase
  private readonly tokenService: ITokenService

  constructor(signInUseCase: SignInUseCase, tokenService: ITokenService) {
    this.signInUseCase = signInUseCase
    this.tokenService = tokenService
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
}
