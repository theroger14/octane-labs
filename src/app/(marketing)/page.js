import Section from "@/components/Section";
import Container from "@/components/Container";
import ButtonLink from "@/components/ButtonLink";

export const metadata = {
  title: "Octane Labs | Impresión 3D",
  description: "Piezas funcionales, prototipos y personalizados. Cotiza subiendo tu STL.",
};

export default function HomePage() {
  return (
    <>
      <section className="py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-medium text-zinc-600">Impresión 3D • Prototipos • Personalizados</p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight">
                Piezas 3D con calidad de taller, listas para usar.
              </h1>
              <p className="mt-4 text-zinc-600 leading-relaxed">
                En Octane Labs fabricamos piezas funcionales, refacciones y prototipos. Compra del catálogo o
                cotiza tu archivo <span className="font-medium">STL</span> en minutos.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/shop">Ver catálogo</ButtonLink>
                <ButtonLink href="/quote" variant="secondary">Cotizar STL</ButtonLink>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-3 text-sm text-zinc-700">
                <li className="rounded-lg border border-zinc-200 p-3">Materiales: PLA / PETG / Resina</li>
                <li className="rounded-lg border border-zinc-200 p-3">Acabados y tolerancias</li>
                <li className="rounded-lg border border-zinc-200 p-3">Envíos y recolección</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-6">
              <p className="text-sm text-zinc-600">Galería (placeholder)</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="aspect-square rounded-xl bg-zinc-100" />
                <div className="aspect-square rounded-xl bg-zinc-100" />
                <div className="aspect-square rounded-xl bg-zinc-100" />
                <div className="aspect-square rounded-xl bg-zinc-100" />
              </div>
              <p className="mt-4 text-sm text-zinc-600">
                Luego aquí pondremos fotos reales de tus mejores impresiones.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Section
        title="¿Qué puedes pedir?"
        subtitle="Compra piezas del catálogo o manda tu diseño. Nosotros nos encargamos del resto."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <Card title="Refacciones y piezas funcionales" desc="Soportes, brackets, adaptadores, engranes simples, etc." />
          <Card title="Prototipos" desc="Itera rápido: prueba forma, ensamble y tolerancias." />
          <Card title="Personalizados" desc="Llaveros, figuras, placas, accesorios, regalos." />
        </div>
      </Section>

      <Section
        title="Listo para empezar"
        subtitle="Si ya tienes un STL, cotiza. Si no, también podemos asesorarte para preparar el archivo."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/quote">Cotizar STL</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Hablar por WhatsApp</ButtonLink>
        </div>
      </Section>
    </>
  );
}

function Card({ title, desc }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    </div>
  );
}
