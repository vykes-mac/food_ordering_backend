import { Menu } from './Menu'
import Pageable from './Pageable'
import Restaurant from './Restaurant'

export default interface IRestaurantRepository {
  findAll(page: number, pageSize: number): Promise<Pageable<Restaurant>>
  findOne(id: string): Promise<Restaurant>
  findByLocation(
    location: Location,
    page: number,
    pageSize: number
  ): Promise<Pageable<Restaurant>>
  search(
    page: number,
    pageSize: number,
    query: string
  ): Promise<Pageable<Restaurant>>

  getMenus(restaurantId: string): Promise<Menu[]>
}
