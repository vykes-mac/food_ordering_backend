import * as express from 'express'
import IRestaurantRepository from '../domain/IRestaurantRepository'
import { Location } from '../domain/Restaurant'

export default class RestaurantController {
  constructor(private readonly repository: IRestaurantRepository) {}

  public async findAll(req: express.Request, res: express.Response) {
    try {
      const { page, limit } = { ...req.query } as { page: any; limit: any }
      return this.repository
        .findAll(parseInt(page), parseInt(limit))
        .then((pageable) =>
          res.status(200).json({
            metadata: {
              page: pageable.page,
              pageSize: pageable.pageSize,
              total_pages: pageable.totalPages,
            },
            restaurants: pageable.data,
          })
        )
        .catch((err: Error) => res.status(404).json({ error: err }))
    } catch (err) {
      return res.status(400).json({ error: err })
    }
  }

  public async findOne(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params
      return this.repository
        .findOne(id)
        .then((restaurant) => res.status(200).json(restaurant))
        .catch((err: Error) => res.status(404).json({ error: err }))
    } catch (err) {
      return res.status(400).json({ error: err })
    }
  }

  public async findByLocation(req: express.Request, res: express.Response) {
    try {
      const { page, limit, longitude, latitude } = req.query as {
        page: string
        limit: string
        longitude: string
        latitude: string
      }

      const location = new Location(parseFloat(longitude), parseFloat(latitude))
      return this.repository
        .findByLocation(location, parseInt(page), parseInt(limit))
        .then((pageable) =>
          res.status(200).json({
            metadata: {
              page: pageable.page,
              pageSize: pageable.pageSize,
              total_pages: pageable.totalPages,
            },
            restaurants: pageable.data,
          })
        )
        .catch((err: Error) => res.status(404).json({ error: err }))
    } catch (err) {
      return res.status(400).json({ error: err })
    }
  }

  public async search(req: express.Request, res: express.Response) {
    try {
      const { page, limit, query } = req.query as {
        page: any
        limit: any
        query: string
      }
      return this.repository
        .search(parseInt(page), parseInt(limit), query)
        .then((pageable) =>
          res.status(200).json({
            metadata: {
              page: pageable.page,
              pageSize: pageable.pageSize,
              total_pages: pageable.totalPages,
            },
            restaurants: pageable.data,
          })
        )
        .catch((err: Error) => res.status(404).json({ error: err }))
    } catch (err) {
      return res.status(400).json({ error: err })
    }
  }

  public async getMenus(req: express.Request, res: express.Response) {
    try {
      const { id } = req.params
      return this.repository
        .getMenus(id)
        .then((menus) =>
          res.status(200).json({
            menu: menus,
          })
        )
        .catch((err: Error) => res.status(404).json({ error: err }))
    } catch (err) {
      return res.status(400).json({ error: err })
    }
  }
}
