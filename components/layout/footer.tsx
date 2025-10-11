import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row md:py-0">
        <div className="text-center text-sm text-muted-foreground md:text-left">
          <p>© 2025 KUILINGA - TANGA GROUP. Tous droits réservés.</p>
          <p>
            Construit avec{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Next.js
            </Link>{" "}
            et{" "}
            <Link
              href="https://tailwindcss.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Tailwind CSS
            </Link>
            .
          </p>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="transition-colors hover:text-foreground">
            Conditions
          </Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">
            Confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  )
}
