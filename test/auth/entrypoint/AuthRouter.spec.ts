import { expect } from 'chai'
import express from 'express'
import request from 'supertest'
import BcryptPasswordService from '../../../src/auth/data/services/BcryptPasswordService'
import JwtTokenService from '../../../src/auth/data/services/JwtTokenService'
import IAuthRepository from '../../../src/auth/domain/IAuthRepository'
import AuthRouter from '../../../src/auth/entrypoint/AuthRouter'
import TokenValidator from '../../../src/auth/helpers/TokenValidator'
import ITokenStore from '../../../src/auth/services/ITokenStore'
import FakeRepository from '../helpers/FakeRepository'
describe('AuthRouter', () => {
  let repository: IAuthRepository
  let app: express.Application

  const user = {
    email: 'tester@gmail.com',
    id: '1556',
    name: 'Ren',
    password: '',
    auth_type: 'google',
  }

  beforeEach(() => {
    repository = new FakeRepository()
    let tokenService = new JwtTokenService('privateKey')
    let passwordService = new BcryptPasswordService()
    let tokenStore = new FakeTokenStore()
    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(
      '/auth',
      AuthRouter.configure(
        repository,
        tokenService,
        tokenStore,
        passwordService,
        new TokenValidator(tokenService, tokenStore)
      )
    )
  })

  it('should return 404 when user is not found', async () => {
    const user = {
      email: 'wrongemail@gg.com',
      id: '1234',
      name: 'Ken',
      password: 'pass123',
      auth_type: 'email',
    }
    await request(app).post('/auth/signin').send(user).expect(404)
  })

  it('should return 200 and token when user is found', async () => {
    await request(app)
      .post('/auth/signin')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.auth_token).to.not.be.empty
      })
  })

  it('should return errors', async () => {
    //act
    await request(app)
      .post('/auth/signup')
      .send({ email: '', password: user.password, auth_type: 'email' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .then((res) => {
        expect(res.body.errors).to.not.be.empty
      })
  })

  it('should create user and return token', async () => {
    let email = 'my@email.com'
    let name = 'test user'
    let password = 'pass123'
    let type = 'email'

    await request(app)
      .post('/auth/signup')
      .send({ email: email, password: password, auth_type: type, name: name })
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.auth_token).to.not.be.empty
      })
  })
})

class FakeTokenStore implements ITokenStore {
  save(token: string): void {
    console.log(token)
  }
  async get(token: string): Promise<string> {
    return token
  }
}
