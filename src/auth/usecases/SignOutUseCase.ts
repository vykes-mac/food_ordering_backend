import ITokenStore from '../services/ITokenStore'

export default class SignOutUseCase {
  constructor(private readonly tokenStore: ITokenStore) {}

  public async execute(token: string): Promise<string> {
    this.tokenStore.save(token)
    return Promise.resolve('Successfully signed out')
  }
}
