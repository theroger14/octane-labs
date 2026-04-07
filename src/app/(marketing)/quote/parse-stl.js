/**
 * Client-side STL parser.
 * Supports both binary and ASCII STL formats.
 *
 * Returns:
 *   { positions: Float32Array, triangle_count, volume_cm3, dimensions: { x, y, z } }
 *
 * `positions` is a flat Float32Array of (x,y,z) triplets per vertex (3 per triangle),
 * ready for use as a THREE.BufferAttribute.
 *
 * Units: STL files typically use millimetres; volume is converted to cm³,
 * dimensions are returned in cm.
 */
export function parseSTL(buffer) {
  const bytes = new Uint8Array(buffer)
  return looksAscii(bytes) ? parseAscii(buffer) : parseBinary(buffer)
}

// Heuristic: scan the first 512 bytes for ASCII keywords
function looksAscii(bytes) {
  const sample = new TextDecoder("utf-8", { fatal: false }).decode(
    bytes.slice(0, 512),
  )
  return /\bfacet\b/.test(sample) || /\bendsolid\b/.test(sample)
}

function signedTetraVol(ax, ay, az, bx, by, bz, cx, cy, cz) {
  return (
    ax * (by * cz - bz * cy) +
    ay * (bz * cx - bx * cz) +
    az * (bx * cy - by * cx)
  ) / 6
}

function parseBinary(buffer) {
  const view = new DataView(buffer)
  const count = view.getUint32(80, true)
  const positions = new Float32Array(count * 9)

  let volume = 0
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

  for (let i = 0; i < count; i++) {
    const off = 84 + i * 50
    const ax = view.getFloat32(off + 12, true)
    const ay = view.getFloat32(off + 16, true)
    const az = view.getFloat32(off + 20, true)
    const bx = view.getFloat32(off + 24, true)
    const by = view.getFloat32(off + 28, true)
    const bz = view.getFloat32(off + 32, true)
    const cx = view.getFloat32(off + 36, true)
    const cy = view.getFloat32(off + 40, true)
    const cz = view.getFloat32(off + 44, true)

    const base = i * 9
    positions[base]     = ax; positions[base + 1] = ay; positions[base + 2] = az
    positions[base + 3] = bx; positions[base + 4] = by; positions[base + 5] = bz
    positions[base + 6] = cx; positions[base + 7] = cy; positions[base + 8] = cz

    volume += signedTetraVol(ax, ay, az, bx, by, bz, cx, cy, cz)

    minX = Math.min(minX, ax, bx, cx); maxX = Math.max(maxX, ax, bx, cx)
    minY = Math.min(minY, ay, by, cy); maxY = Math.max(maxY, ay, by, cy)
    minZ = Math.min(minZ, az, bz, cz); maxZ = Math.max(maxZ, az, bz, cz)
  }

  return {
    positions,
    triangle_count: count,
    volume_cm3: +(Math.abs(volume) / 1000).toFixed(4),
    dimensions: {
      x: +((maxX - minX) / 10).toFixed(2),
      y: +((maxY - minY) / 10).toFixed(2),
      z: +((maxZ - minZ) / 10).toFixed(2),
    },
  }
}

function parseAscii(buffer) {
  const text = new TextDecoder().decode(buffer)
  const re = /vertex\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)\s+([\d.eE+\-]+)/g

  const raw = []
  let m
  while ((m = re.exec(text)) !== null) {
    raw.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]))
  }

  const count = Math.floor(raw.length / 9)
  const positions = new Float32Array(raw)

  let volume = 0
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity

  for (let i = 0; i < count; i++) {
    const b = i * 9
    const [ax, ay, az, bx, by, bz, cx, cy, cz] = raw.slice(b, b + 9)
    volume += signedTetraVol(ax, ay, az, bx, by, bz, cx, cy, cz)

    minX = Math.min(minX, ax, bx, cx); maxX = Math.max(maxX, ax, bx, cx)
    minY = Math.min(minY, ay, by, cy); maxY = Math.max(maxY, ay, by, cy)
    minZ = Math.min(minZ, az, bz, cz); maxZ = Math.max(maxZ, az, bz, cz)
  }

  return {
    positions,
    triangle_count: count,
    volume_cm3: +(Math.abs(volume) / 1000).toFixed(4),
    dimensions: {
      x: +((maxX - minX) / 10).toFixed(2),
      y: +((maxY - minY) / 10).toFixed(2),
      z: +((maxZ - minZ) / 10).toFixed(2),
    },
  }
}
