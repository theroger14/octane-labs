// Supabase Edge Function (Deno runtime)
// Receives a raw STL file body and returns volume, dimensions, triangle count.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const buffer = await req.arrayBuffer();
    if (buffer.byteLength < 84) {
      throw new Error("File too small to be a valid STL");
    }

    const bytes = new Uint8Array(buffer);
    const result = looksLikeAscii(bytes)
      ? parseAsciiStl(buffer)
      : parseBinaryStl(buffer);

    return new Response(JSON.stringify(result), {
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
});

/** Heuristic: check for ASCII STL keywords in the first 512 bytes */
function looksLikeAscii(bytes: Uint8Array): boolean {
  const sample = new TextDecoder("utf-8", { fatal: false }).decode(
    bytes.slice(0, 512),
  );
  return /\bfacet\b/.test(sample) || /\bendsolid\b/.test(sample);
}

function signedTetraVolume(
  ax: number, ay: number, az: number,
  bx: number, by: number, bz: number,
  cx: number, cy: number, cz: number,
): number {
  // Signed volume of tetrahedron formed by triangle (a,b,c) and the origin
  return (
    ax * (by * cz - bz * cy) +
    ay * (bz * cx - bx * cz) +
    az * (bx * cy - by * cx)
  ) / 6;
}

function parseBinaryStl(buffer: ArrayBuffer) {
  const view = new DataView(buffer);
  const count = view.getUint32(80, true);

  let volume = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const off = 84 + i * 50; // header(80) + count(4) + triangle index * 50 bytes
    // Each triangle: 12-byte normal, then 3 × 12-byte vertices, 2-byte attribute
    const ax = view.getFloat32(off + 12, true);
    const ay = view.getFloat32(off + 16, true);
    const az = view.getFloat32(off + 20, true);
    const bx = view.getFloat32(off + 24, true);
    const by = view.getFloat32(off + 28, true);
    const bz = view.getFloat32(off + 32, true);
    const cx = view.getFloat32(off + 36, true);
    const cy = view.getFloat32(off + 40, true);
    const cz = view.getFloat32(off + 44, true);

    volume += signedTetraVolume(ax, ay, az, bx, by, bz, cx, cy, cz);

    minX = Math.min(minX, ax, bx, cx); maxX = Math.max(maxX, ax, bx, cx);
    minY = Math.min(minY, ay, by, cy); maxY = Math.max(maxY, ay, by, cy);
    minZ = Math.min(minZ, az, bz, cz); maxZ = Math.max(maxZ, az, bz, cz);
  }

  const volume_mm3 = Math.abs(volume);
  return {
    volume_cm3: +(volume_mm3 / 1000).toFixed(6),
    dimensions: {
      x: +((maxX - minX) / 10).toFixed(3),
      y: +((maxY - minY) / 10).toFixed(3),
      z: +((maxZ - minZ) / 10).toFixed(3),
    },
    triangle_count: count,
  };
}

function parseAsciiStl(buffer: ArrayBuffer) {
  const text = new TextDecoder().decode(buffer);
  const re = /vertex\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/g;

  const pts: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    pts.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }

  const count = Math.floor(pts.length / 9);
  let volume = 0;
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const base = i * 9;
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = pts.slice(base, base + 9);
    volume += signedTetraVolume(ax, ay, az, bx, by, bz, cx, cy, cz);

    minX = Math.min(minX, ax, bx, cx); maxX = Math.max(maxX, ax, bx, cx);
    minY = Math.min(minY, ay, by, cy); maxY = Math.max(maxY, ay, by, cy);
    minZ = Math.min(minZ, az, bz, cz); maxZ = Math.max(maxZ, az, bz, cz);
  }

  const volume_mm3 = Math.abs(volume);
  return {
    volume_cm3: +(volume_mm3 / 1000).toFixed(6),
    dimensions: {
      x: +((maxX - minX) / 10).toFixed(3),
      y: +((maxY - minY) / 10).toFixed(3),
      z: +((maxZ - minZ) / 10).toFixed(3),
    },
    triangle_count: count,
  };
}
