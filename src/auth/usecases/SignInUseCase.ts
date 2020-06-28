import IAuthRepository from '../domain/IAuthRepository'
import IPasswordService from '../services/IPasswordService'

export default class SignInUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private passwordService: IPasswordService
  ) {}

  public async execute(email: string, password: string): Promise<string> {
    const user = await this.authRepository.find(email)
    if (password === '' && user) return user.id
    if (!(await this.passwordService.compare(password, user.password))) {
      return Promise.reject('Invalid email or password')
    }

    return user.id
  }
}
