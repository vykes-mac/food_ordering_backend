import { Mongoose, PaginateResult } from 'mongoose'
import IRestaurantRepository from '../../domain/IRestaurantRepository'
import { Menu } from '../../domain/Menu'
import Pageable from '../../domain/Pageable'
import Restaurant from '../../domain/Restaurant'
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
  findOne(id: string): Promise<Restaurant> {
    throw new Error('Method not implemented.')
  }
  findByLocation(
    location: Location,
    page: number,
    pageSize: number
  ): Promise<Pageable<Restaurant>> {
    throw new Error('Method not implemented.')
  }
  search(
    page: number,
    pageSize: number,
    query: string
  ): Promise<Pageable<Restaurant>> {
    throw new Error('Method not implemented.')
  }
  getMenus(restaurantId: string): Promise<Menu[]> {
    throw new Error('Method not implemented.')
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
}
