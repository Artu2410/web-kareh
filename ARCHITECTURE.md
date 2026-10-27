# Arquitectura de Kareh Web

## Resumen

Kareh es un sitio multipágina estático. Eleventy genera HTML y CSS listos para publicar; no hay servidor Next.js, SSR ni API propia en producción. Las funciones administrativas de obras sociales usan Supabase Auth y Postgres desde el navegador.

## Tecnologías y comandos

- Node.js 22 y npm.
- Eleventy 3 con Nunjucks.
- HTML, CSS y JavaScript vanilla en el navegador.
- Supabase para autenticación y datos del panel.

```powershell
npm ci
npm run build
npm test
```

`npm run build` elimina únicamente `_site/` antes de invocar Eleventy, evitando que rutas o recursos antiguos permanezcan en la publicación. El resultado queda en `_site/`. `npm test` ejecuta la misma validación. Para desarrollo local: `npx @11ty/eleventy --serve`.

## Fuentes y estructura

```text
src/
├── index.njk
├── servicios/                 # Páginas de especialidades
├── obras-sociales/
├── preguntas/
├── localidades/
├── blog/
├── contacto/
├── privacidad/
├── mapa-del-sitio/
├── _data/site.json            # Datos compartidos por página
├── _includes/
│   ├── header.njk
│   ├── footer.njk
│   └── css/                    # Partials de estilos
└── styles.njk                 # Ensamblado del CSS publicado

assets/                         # Imágenes y scripts del navegador
admin/                          # Panel privado estático
scripts/                        # Build y sincronización de coberturas
```

Las páginas fuente conservan sus rutas públicas como carpetas con `index.njk`. La navegación y el pie de página se editan una vez en `src/_includes/`. `site.json` incluye contexto de conversión indexado por URL.

## CSS y JavaScript

Las páginas enlazan `/styles.css`. Eleventy concatena los partials de `src/_includes/css/` en el mismo orden para generar el único recurso CSS publicado. Los tokens principales de color, tipografía, radios, contenedor, cabecera y espaciado están en el partial base.

Las páginas cargan `/script.js` como módulo, que importa:

- `assets/js/navigation.js`: navegación responsive, dropdown, estado de cabecera y observación de secciones.
- `assets/js/interactions.js`: acordeones, revelado progresivo y efecto tilt.
- `assets/js/analytics.js`: contexto de WhatsApp y eventos de conversión.
- `assets/js/site.js`: año del pie y contador de experiencia.

La lógica de Supabase y del panel permanece en sus scripts separados bajo `assets/js/` y `admin/`.

## Recursos y build

Eleventy copia `assets/`, `admin/` y los archivos públicos de hosting/SEO como passthrough. Los recursos que no son plantillas deben declararse en `.eleventy.js`. No editar `_site/`: se regenera en cada build.

## SEO, sitemap y redirecciones

- `sitemap.xml` y `robots.txt` se publican desde la raíz y deben actualizarse si cambian rutas indexables.
- `/servicios/tratamiento-incontinencia-urinaria/` se conserva como página puente `noindex`, con meta refresh y JavaScript hacia la canónica `/servicios/piso-pelvico/`. No se lista en el sitemap ni se usa en enlaces internos.
- Otras rutas antiguas están mapeadas en `src/404.njk`. En GitHub Pages esos puentes redirigen en el navegador; no generan una respuesta HTTP 301. Para 301 reales se requieren reglas de hosting o CDN que lo soporte.
- `CNAME` y el archivo de verificación de Google se copian como passthrough.

GitHub Pages debe tener **Source: GitHub Actions**. `.github/workflows/pages.yml` ejecuta `npm ci`, `npm run build` y publica `_site/`.

## Panel administrativo y Supabase

`admin/` contiene la interfaz estática para gestionar coberturas. Auth y RLS limitan las lecturas/escrituras en Supabase. URL y clave `anon` son públicas; nunca incluir una clave `service_role` en código cliente.

La página pública de obras sociales tiene tarjetas de respaldo. `scripts/sync-coverage-fallback.js` consulta la vista pública y actualiza los marcadores de `src/obras-sociales/index.njk`. `.github/workflows/sync-coverage-fallback.yml` requiere los secretos `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

Ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para configurar Auth, el administrador y RLS.

## Publicación

Los pushes a `main` ejecutan el workflow de Pages. Antes de publicar:

1. Editar las fuentes en `src/`, nunca archivos de `_site/`.
2. Actualizar enlaces, canonicales y sitemap cuando cambien rutas.
3. Ejecutar `npm test`.
4. Confirmar que GitHub Pages utiliza GitHub Actions como fuente de publicación.
