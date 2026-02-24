import Section from "@/components/Section";

export const metadata = { title: "FAQ | Octane Labs" };

export default function FaqPage() {
  return (
    <Section title="Preguntas frecuentes" subtitle="Lo básico para pedir tu impresión sin sorpresas.">
      <div className="space-y-4">
        <QA q="¿Qué archivo necesito?" a="STL es el más común. Después agregaremos soporte para 3MF/STEP." />
        <QA q="¿Cómo calculan el precio?" a="Por material, tiempo de impresión y un costo mínimo de preparación." />
        <QA q="¿Cuánto tarda?" a="Depende del tamaño y la cola. En la cotización verás una estimación." />
        <QA q="¿Hacen envíos?" a="Sí. Agregaremos costos y zonas cuando integremos la tienda." />
      </div>
    </Section>
  );
}

function QA({ q, a }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-5">
      <p className="font-semibold">{q}</p>
      <p className="mt-2 text-sm text-zinc-600">{a}</p>
    </div>
  );
}
