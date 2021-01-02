import { expect } from 'chai'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import RestaurantRepository from '../../../../src/restaurant/data/repository/RestaurantRepository'
import { cleanUpDb, prepareDb } from '../helpers/helpers'

dotenv.config()
describe('RestaurantRepository', () => {
  let client: mongoose.Mongoose
  let sut: RestaurantRepository
  beforeEach(() => {
    client = new mongoose.Mongoose()
    const connectionStr = encodeURI(process.env.TEST_DB as string)
    client.connect(connectionStr, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })

    sut = new RestaurantRepository(client)
  })

  afterEach(() => {
    client.disconnect()
  })

  describe('findAll', () => {
    beforeEach(async () => {
      await prepareDb(client)
    })

    afterEach(async () => {
      await cleanUpDb(client)
    })

    it('should return restaurants', async () => {
      const result = await sut.findAll(1, 2)

      expect(result).to.not.be.empty
      expect(result.data.length).eq(2)
    })
  })
})
