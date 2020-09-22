import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const useSearchString = (pathname) => {
    /*
    A React hook to manage a search string and
    synchronize URL query parameters
    */
    const router = useRouter();

    const [searchString, setState] = useState();

    useEffect(() => {
        if (searchString == null && router.query['search']) {
            setState(router.query['search'])
        }
    }, [router.query]);

    const updateSearchString = (val) => {
        setState(val);

        const query = (val != '') ? { search: val } : null;

        const href = {
            pathname,
            query: query
        };

        router.push(href, href, {shallow: true});
    };

    return [searchString, updateSearchString]
};

export {useSearchString}
