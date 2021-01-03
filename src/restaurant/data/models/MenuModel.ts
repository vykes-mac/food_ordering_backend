import * as mongoose from 'mongoose'
export interface MenuDocument extends mongoose.Document {
  name: string
  restaurantId: string
  image_url: string
  description: string
}

export interface MenuItemDocument extends mongoose.Document {
  name: string
  menuId: string
  description: string
  image_urls: string[]
  unit_price: number
}

export interface MenuModel extends mongoose.Model<MenuDocument> {}
export interface MenuItemModel extends mongoose.Model<MenuItemDocument> {}

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  menuId: { type: String, required: true },
  description: { type: String, required: true },
  image_urls: { type: [String] },
  unit_price: { type: Number, required: true },
})

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  restaurantId: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String },
})

export { MenuSchema, MenuItemSchema }
