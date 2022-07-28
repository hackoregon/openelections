
import type { AppProps } from 'next/app'
import {useState, useEffect} from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setLoading] = useState(true)
  useEffect(() => {
    const { loadAuth } = props;
    loadAuth().then(() => {
      setLoading(false)
    });
  }, [])
  return <Component {...pageProps} />
}

export default MyApp
