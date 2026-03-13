const STATUS_LABELS = {
  pending:   { label: "Pendiente",  color: "bg-yellow-100 text-yellow-800" },
  reviewed:  { label: "Revisado",   color: "bg-blue-100 text-blue-800"    },
  quoted:    { label: "Cotizado",   color: "bg-purple-100 text-purple-800" },
  completed: { label: "Completado", color: "bg-green-100 text-green-800"  },
  rejected:  { label: "Rechazado",  color: "bg-red-100 text-red-800"      },
}

function getStatusClass(status) {
  const color = STATUS_LABELS[status]?.color ?? "bg-zinc-100 text-zinc-700"
  return "text-xs font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer focus:outline-none " + color
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export default function QuoteRow({ quote, onStatusChange }) {
  const stlLink = quote.stl_file_url
    ? <a href={quote.stl_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">Descargar STL</a>
    : <span className="text-zinc-400 text-xs">Sin archivo</span>

  const phoneEl = quote.phone
    ? <p className="text-xs text-zinc-400">{quote.phone}</p>
    : null

  const colorEl = quote.color
    ? <p className="text-xs text-zinc-400">{quote.color}</p>
    : null

  const quantityEl = quote.quantity > 1
    ? <p className="text-xs text-zinc-400">x{quote.quantity} unidades</p>
    : null

  return (
    <tr className="hover:bg-zinc-50 transition">
      <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">
        {formatDate(quote.created_at)}
      </td>
      <td className="px-6 py-4">
        <p className="font-medium text-zinc-900">{quote.name}</p>
        <a href={"mailto:" + quote.email} className="text-xs text-blue-600 hover:underline">{quote.email}</a>
        {phoneEl}
      </td>
      <td className="px-6 py-4">
        <p className="text-zinc-700">{quote.material || "—"}</p>
        {colorEl}
        {quantityEl}
      </td>
      <td className="px-6 py-4">
        {stlLink}
      </td>
      <td className="px-6 py-4 max-w-xs">
        <p className="text-zinc-600 text-xs line-clamp-2">{quote.notes || "—"}</p>
      </td>
      <td className="px-6 py-4">
        <select value={quote.status} onChange={(e) => onStatusChange(quote.id, e.target.value)} className={getStatusClass(quote.status)}>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </td>
    </tr>
  )
}