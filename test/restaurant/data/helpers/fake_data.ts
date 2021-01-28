import dotenv from 'dotenv'
import faker from 'faker'
import mongoose from 'mongoose'
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
  RestaurantModel,
} from '../../../../src/restaurant/data/models/RestaurantModel'

const addFakeRestaurantsToDev = async () => {
  dotenv.config()
  const connectionStr = encodeURI(process.env.DEV_DB as string)
  let client = new mongoose.Mongoose()
  client.connect(connectionStr, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })

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
  //console.log(restaurants())
  const restaurantDocs = await model.insertMany(restaurants())
  console.log(menus())
  const menuDocs = await insertMenus(restaurantDocs, menuModel)

  await insertMenuItems(menuDocs, menuItemModel)

  //   return restaurantDocs
  console.log('done')
  return
}

function restaurants() {
  return Array(10)
    .fill(10)
    .map((_, idx) => {
      const imgids = [292, 492, 835, 999]

      return {
        name: faker.company.companyName(),
        type: faker.commerce.productName(),
        rating: faker.random.float({ min: 1.0, max: 5.0 }),
        display_img_url: `https://picsum.photos/id/${
          imgids[faker.random.number({ min: 0, max: 3 })]
        }/300`,
        location: {
          coordinates: {
            longitude: Number.parseFloat(faker.address.longitude(40)),
            latitude: Number.parseFloat(faker.address.latitude(70)),
          },
        },
        address: {
          street: faker.address.streetName(),
          city: faker.address.city(),
          parish: faker.address.county(),
          zone: '',
        },
      }
    })
}

function menus() {
  const size = faker.random.number({ max: 5, min: 1 })
  return Array(size)
    .fill(size)
    .map((_, idx) => {
      const imgids = [292, 492, 835, 999]

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image_url: `https://picsum.photos/id/${
          imgids[faker.random.number({ min: 0, max: 3 })]
        }/300`,
      }
    })
}

function menuItems() {
  const size = faker.random.number({ max: 15, min: 5 })
  return Array(size)
    .fill(size)
    .map((_, idx) => {
      const imgids = [292, 492, 835, 999]
      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        image_urls: [
          `https://picsum.photos/id/${
            imgids[faker.random.number({ min: 0, max: 3 })]
          }/300`,
        ],
        unit_price: faker.commerce.price(400, 6000),
      }
    })
}

async function insertMenuItems(
  menuDocs: MenuDocument[],
  menuItemModel: MenuItemModel
) {
  const items: Array<{}> = []
  menuDocs.forEach(async (menu) => {
    const itemsWithMenuId = menuItems().map((item) => {
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
    const menu = menus().map((menu) => {
      return { restaurantId: res.id, ...menu }
    })
    restaurantMenus.push(...menu)
  })

  const menuDocs = await menuModel.insertMany(restaurantMenus)
  return menuDocs
}

addFakeRestaurantsToDev()
