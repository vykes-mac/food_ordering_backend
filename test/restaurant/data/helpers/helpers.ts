import { Mongoose } from 'mongoose'
import {
  MenuDocument,
  MenuItemDocument,
  MenuItemModel,
  MenuItemSchema,
  MenuModel,
  MenuSchema,
} from '../../../../src/restaurant/data/models/MenuModel'
import RestaurantSchema, {
  RestaurantDoc,
} from '../../../../src/restaurant/data/models/RestaurantModel'
import { RestaurantModel } from './../../../../src/restaurant/data/models/RestaurantModel'
export const prepareDb = async (client: Mongoose) => {
  const model = client.model<RestaurantDoc>(
    'Restaurant',
    RestaurantSchema
  ) as RestaurantModel

  const menuModel = client.model<MenuDocument>('Menu', MenuSchema) as MenuModel

  const menuItemModel = client.model<MenuItemDocument>(
    'MenuItem',
    MenuItemSchema
  ) as MenuItemModel

  await model.ensureIndexes()
  const restaurantDocs = await model.insertMany(restaurants)

  const menuDocs = await insertMenus(restaurantDocs, menuModel)

  await insertMenuItems(menuDocs, menuItemModel)

  return restaurantDocs
}

export const cleanUpDb = async (client: Mongoose) => {
  await client.connection.db.dropCollection('restaurants')
  await client.connection.db.dropCollection('menus')
  await client.connection.db.dropCollection('menuitems')
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

const menus = [
  {
    name: 'Lunch',
    description: 'a fun menu',
    image_url: 'menu.jpg',
  },
]

const menuItems = [
  {
    name: 'nuff food',
    description: 'awasome!!',
    image_urls: ['url1', 'url2'],
    unit_price: 12.99,
  },
  {
    name: 'nuff food',
    description: 'awasome!!',
    image_urls: ['url1', 'url2'],
    unit_price: 12.99,
  },
]

async function insertMenuItems(
  menuDocs: MenuDocument[],
  menuItemModel: MenuItemModel
) {
  const items: Array<{}> = []
  menuDocs.forEach(async (menu) => {
    const itemsWithMenuId = menuItems.map((item) => {
      return { menuId: menu.id, ...item }
    })
    items.push(...itemsWithMenuId)
  })

  await menuItemModel.insertMany(items)
}

async function insertMenus(
  restaurantDocs: RestaurantDoc[],
  menuModel: MenuModel
) {
  const restaurantMenus: Array<{}> = []
  restaurantDocs.forEach((res) => {
    const menu = menus.map((menu) => {
      return { restaurantId: res.id, ...menu }
    })
    restaurantMenus.push(...menu)
  })

  const menuDocs = await menuModel.insertMany(restaurantMenus)
  return menuDocs
}
