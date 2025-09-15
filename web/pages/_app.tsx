import type { AppProps } from 'next/app'
import Link from 'next/link'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <header className="site-header">
        <Link href="/" className="site-header__title" aria-label="トップへ">
          えるえぬのメモ帳
        </Link>
      </header>
      <Component {...pageProps} />
    </>
  )
}
