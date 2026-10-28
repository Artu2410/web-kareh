const fs = require('node:fs');
const path = require('node:path');
const configPath = path.resolve(__dirname, '..', 'assets', 'js', 'supabase-config.js');
const configSource = fs.readFileSync(configPath, 'utf8');
const url = configSource.match(/\burl:\s*'([^']+)'/)?.[1];
const key = configSource.match(/\banonKey:\s*'([^']+)'/)?.[1];
if (!url || !key) throw new Error('No se pudo leer la configuración pública de Supabase.');
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const card = coverage => { const name = escapeHtml(coverage.name); const logo = coverage.logo_url ? `<img src="${escapeHtml(coverage.logo_url)}" alt="Logo de ${name}" loading="lazy">` : '<span class="coverage-monogram" aria-hidden="true">K</span>'; const description = coverage.description ? `<p>${escapeHtml(coverage.description)}</p>` : ''; const official = coverage.official_url ? `<a href="${escapeHtml(coverage.official_url)}" target="_blank" rel="noopener noreferrer">Sitio oficial</a>` : ''; return `          <article class="coverage-card" data-coverage-name="${name}">${logo}<h3>${name}</h3>${description}${official}</article>`; };
async function main() {
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/obras_sociales_public?select=name,logo_url,official_url,description&order=name.asc`;
  const response = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!response.ok) throw new Error(`Supabase respondió ${response.status}.`);
  const covers = await response.json();
  if (!Array.isArray(covers)) throw new Error('La respuesta de Supabase no tiene el formato esperado.');
  const missingLogos = covers.filter(coverage => !coverage.logo_url);
  if (missingLogos.length) {
    throw new Error(`No se puede sincronizar el respaldo: faltan logo_url para ${missingLogos.map(coverage => coverage.name).join(', ')}.`);
  }
  const file = path.resolve(__dirname, '..', 'src', 'obras-sociales', 'index.njk');
  const html = fs.readFileSync(file, 'utf8');
  const fallback = `          <!-- coverage-fallback:start -->\n${covers.map(card).join('\n')}\n          <!-- coverage-fallback:end -->`;
  const marker = /          <!-- coverage-fallback:start -->[\s\S]*?          <!-- coverage-fallback:end -->/;
  if (!marker.test(html)) throw new Error('No se encontraron los marcadores coverage-fallback en src/obras-sociales/index.njk.');
  const updated = html.replace(marker, fallback);
  fs.writeFileSync(file, updated);
  console.log(`Respaldo actualizado: ${covers.length} coberturas activas.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
