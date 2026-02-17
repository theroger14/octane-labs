# Octane Labs — 3D Printing Shop + STL Quoter

Web app para un emprendimiento de impresiones 3D: catálogo de productos (Shopify) + módulo de cotización donde el cliente sube un archivo `.stl` y obtiene una estimación basada en material, peso y horas de impresión.

> Objetivo dual: **vender en producción** y servir como **proyecto de portafolio full-stack** (arquitectura, buenas prácticas, despliegue, calidad y documentación).

---

## ✨ Features (MVP → Iterativo)

### MVP (v1)
- Landing de marca (Home, Servicios, FAQ, Contacto)
- Catálogo de productos vía Shopify (rápido: Buy Button / v2: Headless)
- Página de producto con CTA de compra
- Sección “Solicitar cotización” (formulario)  
  - (en v1) sin subida de archivo o subida simple
- UI responsive y SEO básico

### v2 (Portafolio pro)
- Integración Headless con Shopify Storefront API (carrito + checkout URL)
- Subida de `.stl` a storage (sin pasar por el backend)
- Cálculo backend:
  - volumen / bounding box / peso estimado
  - estimación de horas y costo por material
- Panel interno (admin) para ver cotizaciones y estados

### v3 (Automatización de cobro)
- Convertir cotización a Draft Order en Shopify y enviar link de pago/invoice

---

## 🧱 Tech Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- (opcional) Tailwind CSS / UI components

**Backend**
- Next.js Route Handlers (`/app/api/*`) para endpoints de cotizaciones
- Validación: Zod (recomendado)

**Data**
- PostgreSQL
- Prisma ORM

**Ecommerce**
- Shopify (Buy Button para v1 / Storefront API para v2)
- (opcional) Admin API para Draft Orders

**Deploy**
- Vercel (frontend + API serverless)
- Storage para STL: Vercel Blob (recomendado) o S3/R2

---

## 🗺️ Arquitectura (alto nivel)

- **Cliente (Next.js UI)**
  - Páginas públicas (Home, Shop, Product, Quote, Contact)
  - Consumir productos desde Shopify
  - En v2: Carrito y checkout con Storefront API
- **API (Next.js Route Handlers)**
  - Crear cotización
  - Guardar cotización en DB
  - Calcular estimaciones (v2/v3)
- **DB (PostgreSQL)**
  - Quotes, materiales, presets, estados
- **Storage (Blob/S3/R2)**
  - Subida y persistencia de STL

---

## 📁 Estructura de carpetas (planeada)

