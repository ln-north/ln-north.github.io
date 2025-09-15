import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import Link from 'next/link'
import '../styles/globals.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const EXISTING_ID = 'rt-font-v4'
    if (document.getElementById(EXISTING_ID)) return
    const s = document.createElement('script')
    s.id = EXISTING_ID
    s.src = 'https://font.realtype.jp/api/script/v4'
    s.setAttribute('data-rt-user', 'b7ph2luyQ8EDyLcZRuXK9TrifUn3zZFT')
    s.setAttribute('data-rt-input', 'true')
    s.setAttribute('data-rt-nofliker', 'true')
    s.setAttribute('data-rt-layout', 'true')
    // Append as the very last script so the loader reads correct data-attributes
    document.body.appendChild(s)
  }, [])
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
