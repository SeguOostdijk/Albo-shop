import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="overflow-x-hidden">
      {/* Sección decorativa */}
      <div className="bg-primary py-10 text-center">
        <h2 className="text-lg md:text-xl font-black text-white tracking-wide uppercase">
          Club Atlético Independiente de San Cayetano
        </h2>
        <p className="mt-3 text-lg tracking-widest" style={{ color: "#d4af37" }}>
          ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★ ★
        </p>
      </div>

      {/* Main Footer */}
      <div className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Seguinos */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Seguinos</h3>

              <div className="flex justify-center gap-4 sm:justify-start">
                <a
                  href="https://www.facebook.com/cai.sancayetano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-colors hover:text-primary"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>

                <a
                  href="https://www.x.com/CAI_SanCayetano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-colors hover:text-primary"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="h-6 w-6" />
                </a>

                <a
                  href="https://www.instagram.com/cai_sancayetano/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground transition-colors hover:text-primary"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Nosotros */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Nosotros</h3>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Quiénes somos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ayuda */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Ayuda</h3>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="/help/faq"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies/returns"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Políticas Cambios/Devoluciones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/promotions"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Promociones
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
              </ul>

              <Link href="/policies/returns" className="inline-block w-full sm:w-auto cursor-pointer">
                <Button className="mt-4 h-auto w-full bg-primary px-4 py-2 text-xs text-primary-foreground hover:bg-primary/90 sm:w-auto cursor-pointer">
                  BOTÓN DE ARREPENTIMIENTO
                </Button>
              </Link>

              <p className="mt-2 text-xs text-accent">
                * Solicitud de cancelación de compra
              </p>
            </div>

            {/* Contacto */}
            <div className="text-center sm:text-left">
              <h3 className="mb-4 text-lg font-semibold text-primary">Contacto</h3>

              <p className="mb-4 text-sm text-muted-foreground">
                Club Independiente San Cayetano
              </p>

              <Link href="/contact" className="inline-block w-full sm:w-auto cursor-pointer">
                <Button className="h-auto w-full bg-primary px-4 py-2 text-xs uppercase text-primary-foreground hover:bg-primary/90 sm:w-auto cursor-pointer">
                  Contactanos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent bg-primary">
                <span className="text-xs font-bold text-accent">CABJ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}