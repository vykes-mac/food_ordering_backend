import { Mongoose, PaginateResult } from 'mongoose'
import IRestaurantRepository from '../../domain/IRestaurantRepository'
import { Menu, MenuItem } from '../../domain/Menu'
import Pageable from '../../domain/Pageable'
import Restaurant, { Location } from '../../domain/Restaurant'
import {
  MenuDocument,
  MenuItemDocument,
  MenuItemModel,
  MenuItemSchema,
  MenuModel,
  MenuSchema,
} from '../models/MenuModel'
import RestaurantSchema, {
  RestaurantDoc,
  RestaurantModel,
} from '../models/RestaurantModel'

export default class RestaurantRepository implements IRestaurantRepository {
  constructor(private readonly client: Mongoose) {}

  async findAll(page: number, pageSize: number): Promise<Pageable<Restaurant>> {
    const model = this.client.model<RestaurantDoc>(
      'Restaurant',
      RestaurantSchema
    ) as RestaurantModel

    const pageOptions = { page: page, limit: pageSize }

    const pageResults = await model.paginate({}, pageOptions).catch((_) => null)
    return this.restaurantsFromPageResults(pageResults)
  }

  public async findOne(id: string): Promise<Restaurant> {
    const model = this.client.model<RestaurantDoc>(
      'Restaurant',
      RestaurantSchema
    ) as RestaurantModel

    const result = await model.findById(id)

    if (result === null) return Promise.reject('Restaurant not found')

    return new Restaurant(
      result.id,
      result.name,
      result.type,
      result.rating,
      result.display_img_url,
      result.location.coordinates,
      result.address
    )
  }

  public async findByLocation(
    location: Location,
    page: number,
    pageSize: number
  ): Promise<Pageable<Restaurant>> {
    const model = this.client.model<RestaurantDoc>(
      'Restaurant',
      RestaurantSchema
    ) as RestaurantModel

    const pageOptions = { page: page, limit: pageSize, forceCountFn: true }

    const geoQuery = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          $maxDistance: 2,
        },
      },
    }

    const pageResults = await model
      .paginate(geoQuery, pageOptions)
      .catch((_) => null)

    return this.restaurantsFromPageResults(pageResults)
  }
  public async search(
    page: number,
    pageSize: number,
    query: string
  ): Promise<Pageable<Restaurant>> {
    const model = this.client.model<RestaurantDoc>(
      'Restaurant',
      RestaurantSchema
    ) as RestaurantModel

    const pageOptions = { page: page, limit: pageSize }
    const textQuery = { $text: { $search: query } }

    const pageResults = await model
      .paginate(textQuery, pageOptions)
      .catch((_) => null)

    return this.restaurantsFromPageResults(pageResults)
  }

  public async getMenus(restaurantId: string): Promise<Menu[]> {
    const menuModel = this.client.model<MenuDocument>(
      'Menu',
      MenuSchema
    ) as MenuModel

    const menuItemModel = this.client.model<MenuItemDocument>(
      'MenuItem',
      MenuItemSchema
    ) as MenuItemModel

    const menus = await menuModel.find({ restaurantId: restaurantId })
    if (menus === null) return Promise.reject('No menus found')
    const menuIds = menus.map((m) => m.id)

    const items = await menuItemModel.find({ menuId: { $in: menuIds } })

    return this.menusWithItems(menus, items)
  }

  private restaurantsFromPageResults(
    pageResults: PaginateResult<RestaurantDoc> | null
  ) {
    if (pageResults === null || pageResults.docs.length === 0)
      return Promise.reject('Restaurants not found')

    const results = pageResults.docs.map<Restaurant>(
      (model) =>
        new Restaurant(
          model.id,
          model.name,
          model.type,
          model.rating,
          model.display_img_url,
          model.location.coordinates,
          model.address
        )
    )

    return new Pageable<Restaurant>(
      pageResults.page ?? 0,
      pageResults.limit,
      pageResults.totalPages,
      results
    )
  }

  private menusWithItems(
    menus: MenuDocument[],
    items: MenuItemDocument[]
  ): Menu[] {
    return menus.map(
      (menu) =>
        new Menu(
          menu.id,
          menu.restaurantId,
          menu.name,
          menu.image_url,
          menu.description,
          items
            .filter((item) => item.menuId === menu.id)
            .map(
              (menuItem) =>
                new MenuItem(
                  menuItem.id,
                  menuItem.menuId,
                  menuItem.name,
                  menuItem.description,
                  menuItem.image_urls,
                  menuItem.unit_price
                )
            )
        )
    )
  }
}
