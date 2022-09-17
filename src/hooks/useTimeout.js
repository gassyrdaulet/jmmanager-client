import { useEffect, useState } from "react";
import debounce from "lodash.debounce";

export const useTimeout = (delay = 1000, func, args = []) => {
    const [loading, setLoading] = useState(false)

    const clearTimer = debounce(() => {
        setLoading(false)
    }, delay)

    const delayedFunc = async () => {
        if(!loading)
        {
          await func(...args)
          setLoading(true)
        }
    }

    useEffect(() => {
        if(loading){clearTimer()}
    },[loading, clearTimer])
    
    return([loading, delayedFunc])
}