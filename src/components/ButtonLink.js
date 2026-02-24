import Link from "next/link";

export default function ButtonLink({ href, children, variant = "primary" }) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition";
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-800"
      : "border border-zinc-300 text-zinc-900 hover:bg-zinc-50";

  return (
    <Link href={href} className={`${base} ${styles} no-underline`}>
      {children}
    </Link>
  );
}
