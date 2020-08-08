import { NextFunction, Request, Response } from 'express'
import ITokenService from '../services/ITokenService'
import ITokenStore from '../services/ITokenStore'

export default class TokenValidator {
  constructor(
    private readonly tokenService: ITokenService,
    private readonly tokenStore: ITokenStore
  ) {}

  public async validate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader)
      return res.status(401).json({ error: 'Authorization header required' })
    if (
      this.tokenService.decode(authHeader) === '' ||
      (await this.tokenStore.get(authHeader)) !== ''
    )
      return res.status(403).json({ error: 'Invalid Token' })

    next()
  }
}
