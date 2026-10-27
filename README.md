# Kareh Web

Sitio multipágina de Kareh Kinesiología y Fisiatría, generado como sitio estático con Eleventy y Nunjucks. El contenido público conserva rutas limpias y se publica en GitHub Pages.

## Requisitos

- Node.js 22
- npm

## Desarrollo

```powershell
npm ci
npm run build
```

El sitio generado queda en `_site/`. Para servirlo con el servidor de desarrollo de Eleventy:

```powershell
npx @11ty/eleventy --serve
```

`npm test` ejecuta el build de producción y falla si Eleventy no puede generar el sitio.

## Dónde hacer cambios

- `src/`: páginas públicas y plantillas Nunjucks.
- `src/_includes/`: cabecera, pie y módulos fuente del CSS.
- `src/_data/site.json`: datos compartidos por página.
- `assets/js/`: módulos de navegación, interacciones, analítica y datos de Supabase.
- `script.js`: punto de entrada de los módulos del sitio.
- `admin/`: panel administrativo estático.
- `scripts/`: build y sincronización del respaldo de obras sociales.

La arquitectura, rutas de salida, publicación, SEO y conexión con Supabase están descritos en [ARCHITECTURE.md](./ARCHITECTURE.md). Las credenciales públicas y políticas del panel se explican en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
