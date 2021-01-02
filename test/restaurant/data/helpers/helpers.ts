import { Mongoose } from 'mongoose'
import RestaurantSchema, {
  RestaurantDoc,
} from '../../../../src/restaurant/data/models/RestaurantModel'
import { RestaurantModel } from './../../../../src/restaurant/data/models/RestaurantModel'
export const prepareDb = async (client: Mongoose) => {
  const model = client.model<RestaurantDoc>(
    'Restaurant',
    RestaurantSchema
  ) as RestaurantModel

  await model.ensureIndexes()
  return await model.insertMany(restaurants)
}

export const cleanUpDb = async (client: Mongoose) => {
  await client.connection.db.dropCollection('restaurants')
}

const restaurants = [
  {
    name: 'Restuarant Name',
    type: 'Fast Food',
    rating: 4.5,
    display_img_url: 'restaurant.jpg',
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: 'Road 1',
      city: 'City',
      parish: 'Parish',
      zone: 'Zone',
    },
  },
  {
    name: 'Restuarant Name',
    type: 'Fast Food',
    rating: 4.5,
    display_img_url: 'restaurant.jpg',
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: 'Road 1',
      city: 'City',
      parish: 'Parish',
      zone: 'Zone',
    },
  },
  {
    name: 'Restuarant Name',
    type: 'Fast Food',
    rating: 4.5,
    display_img_url: 'restaurant.jpg',
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: 'Road 1',
      city: 'City',
      parish: 'Parish',
      zone: 'Zone',
    },
  },
  {
    name: 'Restuarant Name',
    type: 'Fast Food',
    rating: 4.5,
    display_img_url: 'restaurant.jpg',
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: 'Road 1',
      city: 'City',
      parish: 'Parish',
      zone: 'Zone',
    },
  },
  {
    name: 'Restuarant Name',
    type: 'Fast Food',
    rating: 4.5,
    display_img_url: 'restaurant.jpg',
    location: {
      coordinates: { longitude: 40.33, latitude: 73.23 },
    },
    address: {
      street: 'Road 1',
      city: 'City',
      parish: 'Parish',
      zone: 'Zone',
    },
  },
]
