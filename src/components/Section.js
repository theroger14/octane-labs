import Container from "./Container";

export default function Section({ title, subtitle, children }) {
  return (
    <section className="py-14">
      <Container>
        {(title || subtitle) && (
          <header className="mb-8">
            {title && <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>}
            {subtitle && <p className="mt-2 text-zinc-600">{subtitle}</p>}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}

