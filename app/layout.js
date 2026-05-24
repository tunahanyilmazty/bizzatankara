import { Poppins, DM_Sans, Playfair_Display } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-poppins',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

export const metadata = {
  title: {
    default: 'bizzatankara — Ankara\'yı Keşfet',
    template: '%s — bizzatankara',
  },
  description: 'Ankara\'nın en iyi restoranları, gizli mekanları ve yerel lezzetleri. 54K takipçili bizzatankara ile şehri keşfet.',
  keywords: ['Ankara restoran', 'Ankara yemek', 'Ankara mekan rehberi', 'bizzatankara'],
  authors: [{ name: 'bizzatankara' }],
  creator: 'bizzatankara',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://bizzatankara.com',
    siteName: 'bizzatankara',
    title: 'bizzatankara — Ankara\'yı Keşfet',
    description: 'Ankara\'nın en iyi restoranları, gizli mekanları ve yerel lezzetleri.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'bizzatankara — Ankara\'yı Keşfet',
    description: 'Ankara\'nın en iyi restoranları, gizli mekanları ve yerel lezzetleri.',
  },
  alternates: {
    canonical: 'https://bizzatankara.com',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${poppins.variable} ${dmSans.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  )
}