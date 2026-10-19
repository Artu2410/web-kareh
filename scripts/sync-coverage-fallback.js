const fs = require('node:fs');
const path = require('node:path');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Definí SUPABASE_URL y SUPABASE_ANON_KEY para sincronizar el respaldo.');
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const card = coverage => { const name = escapeHtml(coverage.name); const logo = coverage.logo_url ? `<img src="${escapeHtml(coverage.logo_url)}" alt="Logo de ${name}" loading="lazy">` : '<span class="coverage-monogram" aria-hidden="true">K</span>'; const description = coverage.description ? `<p>${escapeHtml(coverage.description)}</p>` : ''; const official = coverage.official_url ? `<a href="${escapeHtml(coverage.official_url)}" target="_blank" rel="noopener noreferrer">Sitio oficial</a>` : ''; return `          <article class="coverage-card" data-coverage-name="${name}">${logo}<h3>${name}</h3>${description}${official}</article>`; };
async function main() {
  const endpoint = `${url.replace(/\/$/, '')}/rest/v1/obras_sociales_public?select=name,logo_url,official_url,description&order=name.asc`;
  const response = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!response.ok) throw new Error(`Supabase respondió ${response.status}.`);
  const covers = await response.json();
  if (!Array.isArray(covers)) throw new Error('La respuesta de Supabase no tiene el formato esperado.');
  const file = path.resolve(__dirname, '..', 'obras-sociales', 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const fallback = `          <!-- coverage-fallback:start -->\n${covers.map(card).join('\n')}\n          <!-- coverage-fallback:end -->`;
  const updated = html.replace(/          <!-- coverage-fallback:start -->[\s\S]*?          <!-- coverage-fallback:end -->/, fallback);
  if (updated === html) throw new Error('No se encontraron los marcadores coverage-fallback en obras-sociales/index.html.');
  fs.writeFileSync(file, updated);
  console.log(`Respaldo actualizado: ${covers.length} coberturas activas.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
