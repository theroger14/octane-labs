"use client"

import { useEffect, useRef } from "react"

/**
 * Three.js STL viewer.
 * Expects `positions` — a Float32Array from parse-stl.js.
 * Three.js is loaded dynamically so it doesn't bloat the SSR bundle.
 */
export default function StlViewer({ positions }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!positions?.length || !mountRef.current) return

    let cancelled = false
    let cleanup = null

    async function init() {
      const THREE = await import("three")
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      )
      if (cancelled || !mountRef.current) return

      const container = mountRef.current
      const W = container.clientWidth || 400
      const H = 260

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.setClearColor(new THREE.Color("#F8FAFC"))
      container.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.001, 1e6)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.08

      // Build geometry
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3),
      )
      geometry.computeVertexNormals()

      // Center mesh around origin
      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      const center = new THREE.Vector3()
      box.getCenter(center)
      geometry.translate(-center.x, -center.y, -center.z)
      geometry.computeBoundingBox()

      const size = new THREE.Vector3()
      geometry.boundingBox.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z) || 1

      camera.position.set(maxDim * 1.4, maxDim * 0.8, maxDim * 1.4)
      camera.near = maxDim * 0.001
      camera.far = maxDim * 500
      camera.updateProjectionMatrix()
      controls.update()

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({
          color: 0xf97316,
          specular: 0x333333,
          shininess: 25,
          side: THREE.DoubleSide,
        }),
      )
      scene.add(mesh)

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const d1 = new THREE.DirectionalLight(0xffffff, 0.9)
      d1.position.set(1, 2, 1.5)
      scene.add(d1)
      const d2 = new THREE.DirectionalLight(0xffffff, 0.3)
      d2.position.set(-1, -1, -1)
      scene.add(d2)

      let animId
      function animate() {
        animId = requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      // Responsive resize
      const ro = new ResizeObserver(() => {
        const nw = container.clientWidth
        renderer.setSize(nw, H)
        camera.aspect = nw / H
        camera.updateProjectionMatrix()
      })
      ro.observe(container)

      cleanup = () => {
        cancelAnimationFrame(animId)
        ro.disconnect()
        controls.dispose()
        geometry.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    init()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [positions])

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "260px",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#F8FAFC",
        border: "1px solid #E2E8F0",
      }}
    />
  )
}
