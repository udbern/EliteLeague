// app/layout.js


import './globals.css';
import { Montserrat, Mukta, Raleway } from 'next/font/google';
import ClientLayout from './ClientLayout';
import { ClientRootLayout } from './ClientRootLayout';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

const mukta = Mukta({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mukta',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-raleway',
});

export const metadata = {
  title: 'Elite League - Gaming Platform',
  description: 'Your destination for competitive gaming and esports',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${mukta.variable} ${raleway.variable}`}
    >
      <body className="antialiased  flex flex-col">
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}
