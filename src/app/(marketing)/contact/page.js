import Section from "@/components/Section";

export const metadata = { title: "Contacto | Octane Labs" };

export default function ContactPage() {
  return (
    <Section
      title="Contacto"
      subtitle="Envíanos tu idea y te respondemos con tiempos y recomendaciones."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 p-5">
          <h3 className="font-semibold">WhatsApp (recomendado)</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Agrega aquí tu número o link wa.me cuando lo tengas.
          </p>
          <div className="mt-4 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">
            Placeholder: wa.me/52XXXXXXXXXX
          </div>
        </div>

        <form className="rounded-2xl border border-zinc-200 p-5 space-y-4">
          <Field label="Nombre" name="name" placeholder="Tu nombre" />
          <Field label="Correo" name="email" placeholder="tu@email.com" type="email" />
          <Field label="Mensaje" name="message" placeholder="¿Qué necesitas imprimir?" textarea />
          <button
            type="button"
            className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800"
          >
            Enviar (placeholder)
          </button>
          <p className="text-xs text-zinc-500">
            En Fase 2 conectamos este formulario a un endpoint real.
          </p>
        </form>
      </div>
    </Section>
  );
}

function Field({ label, name, placeholder, type = "text", textarea = false }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={5}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      )}
    </label>
  );
}
