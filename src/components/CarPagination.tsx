import {
  Pagination,
  PaginationItem,
  PaginationRenderItemParams,
} from '@material-ui/lab'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import { getAsString } from '../getAsString'

export function CarPagination({ totalPage }: { totalPage: number }) {
  const { query } = useRouter()
  return (
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
