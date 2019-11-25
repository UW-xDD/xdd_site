import {useState, useEffect} from 'react'
import { useRouter } from 'next/router'

const useSearchString = (pathname)=> {
  /*
  A React hook to manage a search string and
  synchronize URL query parameters
  */
  const router = useRouter();

  const [searchString, setState] = useState()

  useEffect(()=>{
    if (searchString == null) {
      setState(router.query.search)
    }
  }, [router.query]);

  const updateSearchString = (val)=>{
    setState(val)
    // Update query to house search string
    const href = {
      pathname,
      query: {search: val}
    };
    const as = href;
    router.push(href, as, {shallow: true});
  }

  return [searchString, updateSearchString]
}

export {useSearchString}
