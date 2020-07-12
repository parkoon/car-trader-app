import React from 'react'
import { useRouter } from 'next/router'
import { Grid } from '@material-ui/core'
import Search from '.'
import { Model, getModels } from '../database/getModels'
import { CarModel } from '../../api/Car'
import { Make, getMakes } from '../database/getMakes'
import { GetServerSideProps } from 'next'
import { getAsString } from '../getAsString'
import { getPagenatedCars } from '../database/getPaginatedCard'
import Link from 'next/link'
import { ParsedUrlQuery } from 'querystring'

import {
  PaginationRenderItemParams,
  PaginationItem,
  Pagination,
} from '@material-ui/lab'

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
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>

      <Grid item xs={12} sm={7} md={9} lg={10}>
        <Pagination
          page={parseInt(getAsString(query.page) || '1')}
          count={totalPage}
          renderItem={(item) => (
            <PaginationItem
              component={MaterialUiLink}
              query={query}
              item={item}
              {...item}
            />
          )}
        />
        <pre style={{ fontSize: '3rem' }}>
          {JSON.stringify({ cars, totalPage }, null, 4)}
        </pre>
      </Grid>
    </Grid>
  )
}

export interface MaterialUiLinkProps {
  item: PaginationRenderItemParams
  query: ParsedUrlQuery
}

const MaterialUiLink = React.forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(
  ({ item, query, ...props }, ref) => (
    <Link
      href={{
        pathname: '/cars',
        query: { ...query, page: item.page },
      }}
    >
      <a ref={ref} {...props}></a>
    </Link>
  )
)

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
