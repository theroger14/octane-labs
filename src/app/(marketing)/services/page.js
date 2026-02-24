import Section from "@/components/Section";

export const metadata = { title: "Servicios | Octane Labs" };

export default function ServicesPage() {
  return (
    <Section
      title="Servicios"
      subtitle="Opciones de impresión y recomendaciones para que tu pieza salga bien."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Item title="FDM (filamento)" desc="Ideal para piezas funcionales y prototipos. Buen costo/beneficio." />
        <Item title="SLA (resina)" desc="Mejor detalle superficial. Ideal para piezas pequeñas y estéticas." />
        <Item title="Materiales" desc="PLA / PETG / Resina (ajustaremos catálogo real después)." />
        <Item title="Acabados" desc="Lijado, pintura (opcional), ajustes de tolerancias, inserciones." />
      </div>
    </Section>
  );
}

function Item({ title, desc }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    </div>
  );
}
