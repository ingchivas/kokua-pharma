import './globals.css'
import {Providers} from "./providers";

export const metadata = {
  title: 'Kokua Pharma',
  description: 'Kokua Pharma',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
      <body>{children}</body>
      </Providers>
    </html>
  )
}
