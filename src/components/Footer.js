import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-10">
      <Container className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-600">
          © {new Date().getFullYear()} Octane Labs. Impresión 3D.
        </p>
        <p className="text-sm text-zinc-600">
          Hecho con Next.js • Portafolio Full-Stack
        </p>
      </Container>
    </footer>
  );
}
