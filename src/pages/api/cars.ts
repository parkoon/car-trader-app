import { NextApiRequest, NextApiResponse } from 'next'
import { getPagenatedCars } from '../../database/getPaginatedCard'

export default async function cars(req: NextApiRequest, res: NextApiResponse) {
  const cars = await getPagenatedCars(req.query)
  res.json(cars)
}
