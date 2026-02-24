import Link from "next/link";
import Container from "./Container";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/shop", label: "Tienda" },
  { href: "/services", label: "Servicios" },
  { href: "/quote", label: "Cotizar" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <Container className="py-4 flex items-center justify-between">
        <Link href="/" className="no-underline font-semibold tracking-tight">
          Octane Labs
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="no-underline text-sm text-zinc-700 hover:text-zinc-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/quote"
          className="no-underline text-sm font-medium rounded-lg bg-zinc-900 text-white px-3 py-2 hover:bg-zinc-800"
        >
          Cotizar STL
        </Link>
      </Container>
    </header>
  );
}
