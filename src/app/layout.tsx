import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: '...'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kz">
      <body>
        {children}
      </body>
    </html>
  );
}
