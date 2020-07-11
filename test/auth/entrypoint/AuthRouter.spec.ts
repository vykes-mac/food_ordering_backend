import { expect } from 'chai'
import express from 'express'
import request from 'supertest'
import BcryptPasswordService from '../../../src/auth/data/services/BcryptPasswordService'
import JwtTokenService from '../../../src/auth/data/services/JwtTokenService'
import IAuthRepository from '../../../src/auth/domain/IAuthRepository'
import AuthRouter from '../../../src/auth/entrypoint/AuthRouter'
import FakeRepository from '../helpers/FakeRepository'
describe('AuthRouter', () => {
  let repository: IAuthRepository
  let app: express.Application

  const user = {
    email: 'baller@gg.com',
    id: '1234',
    name: 'Ken',
    password: 'pass',
    type: 'email',
  }

  beforeEach(() => {
    repository = new FakeRepository()
    let tokenService = new JwtTokenService('privateKey')
    let passowrdService = new BcryptPasswordService()

    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(
      '/auth',
      AuthRouter.configure(repository, tokenService, passowrdService)
    )
  })

  it('should return 404 when user is not found', async () => {
    await request(app).post('/auth/signin').send({}).expect(404)
  })

  it('should return 200 and token when user is found', async () => {
    await request(app)
      .post('/auth/signin')
      .send({ email: user.email, password: user.password })
      .set('Accept', 'application/json')
      .expect('Content-type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.auth_token).to.not.be.empty
      })
  })
})
