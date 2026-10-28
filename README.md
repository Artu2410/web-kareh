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

El sitio generado queda en `_site/`; el build de producción también minifica `styles.css`.
Para servirlo con el servidor de desarrollo de Eleventy:

```powershell
npx @11ty/eleventy --serve
```

`npm test` ejecuta el build de producción y falla si Eleventy no puede generar el sitio.

El panel `/admin/` permite cargar los logos locales predeterminados a Supabase Storage
para las coberturas activas que todavía no tienen `logo_url`. La operación requiere
una sesión de administrador y las políticas de la migración de Storage. Después de
completarla, `npm run sync:coverage` actualiza el respaldo estático desde Supabase;
falla explícitamente si alguna cobertura activa todavía no tiene logo. El comando
usa únicamente la URL y la clave pública ya configuradas para el sitio.

## Dónde hacer cambios

- `src/`: páginas públicas y plantillas Nunjucks.
- `src/_includes/`: layout base, cabecera, pie y módulos fuente del CSS.
- `src/_data/site.json`: contacto, horarios, profesional, redes y WhatsApp.
- `src/_data/nav.json`: navegación principal, servicios, localidades y enlaces del footer.
- `assets/js/`: módulos de navegación, interacciones, analítica y datos de Supabase.
- `script.js`: punto de entrada de los módulos del sitio.
- `admin/`: panel administrativo estático.
- `scripts/`: build y sincronización del respaldo de obras sociales.
