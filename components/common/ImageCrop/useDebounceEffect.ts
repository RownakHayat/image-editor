import { useEffect, DependencyList } from 'react'

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: DependencyList = [],
) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      fn()
    }, waitTime)

    return () => {
      clearTimeout(timeout)
    }
  }, [...deps, waitTime]) 
}
