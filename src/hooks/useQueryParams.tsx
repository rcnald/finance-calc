import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type QueryParams<T extends string | number | boolean> = T
type setQueryParams<T extends string | number | boolean> = (value: T) => void
type createQueryParams<T extends string | number | boolean> = (
  value: T,
) => string

type useQueryParamParams<T extends string | number | boolean> = (
  query: string,
) => [
  getQuery: QueryParams<T>,
  setQuery: setQueryParams<T>,
  createQuery: createQueryParams<T>,
]

export function useQueryParams<T extends string | number | boolean>(
  query: string,
  defaultValue: T | undefined = '' as T,
  allowedValues: T[],
): ReturnType<useQueryParamParams<T>> {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const setQuery: setQueryParams<T> = (value) => {
    const params = new URLSearchParams(searchParams)

    value ? params.set(query, `${value}`) : params.delete(query)

    replace(`${pathname}?${params.toString()}`)
  }

  const getQuery = () => {
    const queryValue = searchParams.get(query) as T
    const isQueryValide = allowedValues
      ?.map((value) => value.toString())
      .includes(queryValue?.toString())

    if (isQueryValide) return queryValue

    return defaultValue
  }

  const queryValue = getQuery()

  const createQuery: createQueryParams<T> = (_value) => {
    let value = ''
    if (typeof _value === 'number') value = _value.toString()

    const params = new URLSearchParams(searchParams)

    value ? params.set(query, value) : params.delete(query)

    return `${pathname}?${params.toString()}`
  }

  return [queryValue, setQuery, createQuery]
}
