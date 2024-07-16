import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type QueryParams<T extends string | number | boolean> = T
type SetQueryParams<T extends string | number | boolean> = (value: T) => void

type useQueryParamParams<T extends string | number | boolean> = (
  query: string,
) => [getQuery: QueryParams<T>, setQuery: SetQueryParams<T>]

export function useQueryParams<T extends string | number | boolean>(
  query: string,
  defaultValue: T,
  allowedValues?: T[],
): ReturnType<useQueryParamParams<T>> {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const setQuery: SetQueryParams<T> = (value) => {
    const params = new URLSearchParams(searchParams)

    value ? params.set(query, `${value}`) : params.delete(query)

    replace(`${pathname}?${params.toString()}`)
  }

  const getQuery = (): T => {
    const queryValue = searchParams.get(query) ?? ''

    const isQueryValide =
      allowedValues !== undefined
        ? allowedValues.map((value) => value.toString()).includes(queryValue)
        : true

    if (!isQueryValide) return defaultValue

    if (
      (defaultValue === true || defaultValue === false) &&
      queryValue !== 'true' &&
      queryValue !== 'false'
    ) {
      return defaultValue
    }

    if (queryValue === 'true' || queryValue === 'false') {
      return (queryValue === 'true') as T
    }

    if (!Number.isNaN(Number(queryValue))) {
      return Number(queryValue === '' ? defaultValue : queryValue) as T
    }

    return queryValue as T
  }

  const queryValue = getQuery()

  return [queryValue, setQuery]
}
