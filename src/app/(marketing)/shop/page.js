import Section from "@/components/Section";
import ButtonLink from "@/components/ButtonLink";

export const metadata = { title: "Tienda | Octane Labs" };

export default function ShopPage() {
  return (
    <Section
      title="Tienda"
      subtitle="Aquí conectaremos Shopify (Buy Button primero, luego headless)."
    >
      <div className="rounded-2xl border border-zinc-200 p-5">
        <p className="text-sm text-zinc-600">
          Placeholder: productos destacados / colecciones.
        </p>
        <div className="mt-4 flex gap-3">
          <ButtonLink href="/quote">Cotizar STL</ButtonLink>
          <ButtonLink href="/" variant="secondary">Volver al inicio</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
