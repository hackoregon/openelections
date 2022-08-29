import { Provider, useStore } from 'react-redux'
import type { AppProps } from 'next/app'
import {useState, useEffect} from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [isLoading, setLoading] = useState(true)
  const store = useStore(pageProps.initialReduxState)
  
  useEffect(() => {
    loadAuth().then(() => {
      setLoading(false)
    });
  }, [])
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
