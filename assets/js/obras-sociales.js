(() => {
  const config = window.KAREH_SUPABASE_CONFIG || {}, grid = document.querySelector('#coverage-grid'), input = document.querySelector('#coverage-search'), empty = document.querySelector('#coverage-empty');
  if (!grid || !input || !empty) return; if (!config.url || !config.anonKey) { console.error('Falta la configuraci?n p?blica de Supabase para el listado de coberturas.'); return; } if (!window.supabase || typeof window.supabase.createClient !== 'function') { console.error('No se pudo cargar Supabase JS; se conserva el listado est?tico.'); return; }
  const client = window.supabase.createClient(config.url, config.anonKey); let covers = null;
  const esc = (v = '') => v.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const addImageFallbacks = () => {
    grid.querySelectorAll('img').forEach(image => image.addEventListener('error', () => {
      const monogram = document.createElement('span');
      monogram.className = 'coverage-monogram';
      monogram.setAttribute('aria-hidden', 'true');
      monogram.textContent = 'K';
      image.replaceWith(monogram);
    }, { once: true }));
  };
  const draw = () => { const items = covers.filter(x => x.name.toLocaleLowerCase().includes(input.value.trim().toLocaleLowerCase())); grid.innerHTML = items.map(x => `<article class="coverage-card" data-coverage-name="${esc(x.name)}">${x.logo_url ? `<img src="${esc(x.logo_url)}" alt="Logo de ${esc(x.name)}" loading="lazy">` : '<span class="coverage-monogram" aria-hidden="true">K</span>'}<h3>${esc(x.name)}</h3>${x.description ? `<p>${esc(x.description)}</p>` : ''}${x.official_url ? `<a href="${esc(x.official_url)}" target="_blank" rel="noopener noreferrer">Sitio oficial</a>` : ''}</article>`).join(''); addImageFallbacks(); empty.hidden = items.length > 0; };
  const filterFallback = () => { const term = input.value.trim().toLocaleLowerCase(); let visible = 0; grid.querySelectorAll('[data-coverage-name]').forEach(card => { const matches = card.dataset.coverageName.toLocaleLowerCase().includes(term); card.hidden = !matches; if (matches) visible += 1; }); empty.hidden = visible > 0; };
  input.addEventListener('input', () => { if (covers) draw(); else filterFallback(); });
  addImageFallbacks();
  client.from('obras_sociales_public').select('*').order('name').then(({data,error}) => { if (error) { console.error('No se pudo actualizar el listado de coberturas; se conserva el respaldo est?tico.', error); return; } if (!Array.isArray(data)) { console.error('La respuesta de coberturas no tiene el formato esperado; se conserva el respaldo est?tico.'); return; } covers = data; draw(); });
  document.querySelectorAll('[data-coverage-whatsapp]').forEach(link => link.addEventListener('click', () => { if (typeof window.gtag === 'function') window.gtag('event', 'click_whatsapp_cobertura', {page_path: location.pathname}); }));
})();
