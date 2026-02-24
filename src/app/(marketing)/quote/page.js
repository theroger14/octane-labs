import Section from "@/components/Section";
import ButtonLink from "@/components/ButtonLink";

export const metadata = { title: "Cotizar | Octane Labs" };

export default function QuotePage() {
  return (
    <Section
      title="Cotiza tu impresión"
      subtitle="En la siguiente fase agregamos subida de STL + cálculo de volumen/peso/tiempo."
    >
      <div className="rounded-2xl border border-zinc-200 p-5">
        <ol className="list-decimal pl-5 space-y-2 text-sm text-zinc-700">
          <li>Seleccionar material</li>
          <li>Subir archivo .STL</li>
          <li>Ver estimación</li>
          <li>Enviar solicitud / pagar</li>
        </ol>

        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/contact">Pedir por WhatsApp</ButtonLink>
          <ButtonLink href="/shop" variant="secondary">Ver catálogo</ButtonLink>
        </div>
      </div>
    </Section>
  );
}
