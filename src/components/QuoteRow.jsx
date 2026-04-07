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
  return new Date(dateStr).toLocaleDateString("es-MX", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

function fmtMXN(n) {
  if (n == null) return "—"
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(n)
}

export default function QuoteRow({ quote, onStatusChange }) {
  const materialName = quote.materials?.name ?? "—"

  const fileEl = quote.file_url
    ? <a href={quote.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">
        {quote.file_name ?? "Descargar STL"}
      </a>
    : <span className="text-zinc-400 text-xs">Sin archivo</span>

  return (
    <tr className="hover:bg-zinc-50 transition">
      <td className="px-6 py-4 text-zinc-500 whitespace-nowrap text-sm">
        {formatDate(quote.created_at)}
      </td>
      <td className="px-6 py-4">
        <p className="font-medium text-zinc-900">{quote.customer_name ?? "—"}</p>
        {quote.customer_email && (
          <a href={"mailto:" + quote.customer_email} className="text-xs text-blue-600 hover:underline">
            {quote.customer_email}
          </a>
        )}
      </td>
      <td className="px-6 py-4">
        <p className="text-zinc-700">{materialName}</p>
        <p className="text-xs text-zinc-400">Relleno: {quote.infill_percent}%</p>
        {quote.quantity > 1 && (
          <p className="text-xs text-zinc-400">×{quote.quantity} unidades</p>
        )}
      </td>
      <td className="px-6 py-4">
        {quote.volume_cm3 != null && (
          <p className="text-xs text-zinc-600">{quote.volume_cm3} cm³</p>
        )}
        {quote.weight_grams != null && (
          <p className="text-xs text-zinc-400">{quote.weight_grams} g</p>
        )}
        {quote.print_time_hours != null && (
          <p className="text-xs text-zinc-400">{quote.print_time_hours} h</p>
        )}
      </td>
      <td className="px-6 py-4">
        <p className="font-semibold text-zinc-900">{fmtMXN(quote.total_price)}</p>
        {fileEl}
      </td>
      <td className="px-6 py-4 max-w-xs">
        <p className="text-zinc-600 text-xs line-clamp-2">{quote.notes ?? "—"}</p>
      </td>
      <td className="px-6 py-4">
        <select
          value={quote.status}
          onChange={(e) => onStatusChange(quote.id, e.target.value)}
          className={getStatusClass(quote.status)}
        >
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <option key={key} value={key}>{val.label}</option>
          ))}
        </select>
      </td>
    </tr>
  )
}
