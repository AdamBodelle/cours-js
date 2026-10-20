import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import "./globals.css";
// Titre de l'onglet + description pour Google
export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Projets et tâches — M2 ESIEE-IT",
};
type Props = { children: ReactNode };
// Mise en page commune : elle entoure TOUTES les pages
export default function RootLayout({ children }: Props) {
  return (
    <html lang="fr">
      <body>
        <div className="app">
          <header className="topbar">
            <Link href="/" className="brand">
              TaskFlow
            </Link>
            <nav className="nav" aria-label="Navigation">
              <Link href="/">Projets</Link>
              <Link href="/about">À propos</Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
