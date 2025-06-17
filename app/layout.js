// app/layout.js


import './globals.css';
import { Montserrat, Mukta, Raleway } from 'next/font/google';
import ClientLayout from './ClientLayout';
import { ClientRootLayout } from './ClientRootLayout';
import { SeasonProvider } from "@/components/SeasonProvider";
import { CompetitionProvider } from "@/components/CompetitionProvider";
import { PageLoader } from "@/components/ui/loader";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

const mukta = Mukta({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-mukta',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-raleway',
});

export const metadata = {
  title: 'E-Football',
  description: 'E-Football League Management System',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${mukta.variable} ${raleway.variable}`}
    >
      <body className="antialiased  flex flex-col">
        <PageLoader />
        <SeasonProvider>
          <CompetitionProvider>
            <ClientRootLayout>
              {children}
            </ClientRootLayout>
          </CompetitionProvider>
        </SeasonProvider>
        <PageLoader />
        <ScrollToTop />
      </body>
    </html>
  );
}
