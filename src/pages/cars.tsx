import { Grid } from '@material-ui/core'
import deepEqual from 'fast-deep-equal'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { stringify } from 'querystring'
import React, { useState } from 'react'
import useSWR from 'swr'
import Search from '.'
import { CarModel } from '../../api/Car'
import { CarCard } from '../components/CarCard'
import { CarPagination } from '../components/CarPagination'
import { getMakes, Make } from '../database/getMakes'
import { getModels, Model } from '../database/getModels'
import { getPagenatedCars } from '../database/getPaginatedCard'
import { getAsString } from '../getAsString'

export interface CarsListProps {
  makes: Make[]
  models: Model[]
  cars: CarModel[]
  totalPage: number
}

export default function CarsList({
  makes,
  models,
  cars,
  totalPage,
}: CarsListProps) {
  const { query } = useRouter()
  const [serverQuery] = useState(query)
  const { data } = useSWR('/api/cars?' + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery) ? { cars, totalPage } : null,
  })

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>

      <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
        <Grid item xs={12}>
          <CarPagination totalPage={data?.totalPage} />
        </Grid>
        {(data?.cars || []).map((car) => (
          <Grid key={car.id} item xs={12} sm={6}>
            <CarCard car={car} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <CarPagination totalPage={data?.totalPage} />
        </Grid>
      </Grid>
    </Grid>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make)

  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPagenatedCars(ctx.query),
  ])
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPage: pagination.totalPage,
    },
  }
}
