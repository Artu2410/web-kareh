(() => {
  const config = window.KAREH_SUPABASE_CONFIG || {}, grid = document.querySelector('#coverage-grid'), input = document.querySelector('#coverage-search'), empty = document.querySelector('#coverage-empty');
  if (!grid || !config.url || !config.anonKey) return;
  const client = window.supabase.createClient(config.url, config.anonKey); let covers = [];
  const localLogos = {
    'ACTIVA SALUD': '../assets/logos/activa-salud.jpg',
    'AMEBPBA': '../assets/logos/amebpba.jpg',
    'AMFFA': '../assets/logos/amffa.png',
    'AMSTERDAM SALUD': '../assets/logos/amsterdam-salud.png',
    'ASOCIACIÓN ECLESIÁSTICA SAN PEDRO': '../assets/logos/asociacion-eclesiastica-san-pedro.png',
    'AVALIAN SALUD Y BIENESTAR': '../assets/logos/avalian.png',
    'CASA': '../assets/logos/casa.png',
    'COLEGIO DE ESCRIBANOS': '../assets/logos/colegio-de-escribanos.png',
    'COLONIA SUIZA': '../assets/logos/colonia-suiza.png',
    'COMEI': '../assets/logos/comei.png',
    'E. W. HOPE': '../assets/logos/e-w-hope.svg',
    'FEDERADA SALUD': '../assets/logos/federada-salud.jpg',
    'IOMA': '../assets/logos/ioma.png',
    'JERARQUICOS': '../assets/logos/jerarquicos.png',
    'LA SEGUNDA PERSONAS': '../assets/logos/la-segunda.jpg',
    'LUIS PASTEUR': '../assets/logos/luis-pasteur.png',
    'MEDIFE SA': '../assets/logos/medife.svg',
    'OPDEA': '../assets/logos/opdea.jpg',
    'OSDOP': '../assets/logos/osdop.png',
    'OSPE': '../assets/logos/ospe.jpg',
    'OSPEDYC': '../assets/logos/ospedyc.png',
    'OSFATUN': '../assets/logos/osfatun.png',
    'PODER JUDICIAL': '../assets/logos/poder-judicial.jpg',
    'SANCOR': '../assets/logos/sancor.png',
    'SCIS S.A.': '../assets/logos/scis.png',
    'SWISS MEDICAL S.A.': '../assets/logos/swiss-medical.png'
  };
  const adminLink = document.querySelector('#coverage-admin-link');
  client.auth.getUser().then(async ({ data: { user } }) => { if (!user || !adminLink) return; const { data: profile } = await client.from('profiles').select('role').eq('id', user.id).maybeSingle(); if (profile?.role === 'admin') { adminLink.href = '../admin/'; adminLink.textContent = 'Administrar obras sociales'; } });
  const esc = (v = '') => v.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const draw = () => { const items = covers.filter(x => x.name.toLocaleLowerCase().includes(input.value.trim().toLocaleLowerCase())); grid.innerHTML = items.map(x => { const logoUrl = x.logo_url || localLogos[x.name]; return `<article class="coverage-card">${logoUrl ? `<img src="${esc(logoUrl)}" alt="Logo de ${esc(x.name)}" loading="lazy">` : '<span class="coverage-monogram" aria-hidden="true">K</span>'}<h3>${esc(x.name)}</h3>${x.description ? `<p>${esc(x.description)}</p>` : ''}${x.official_url ? `<a href="${esc(x.official_url)}" target="_blank" rel="noopener noreferrer">Sitio oficial</a>` : ''}</article>`; }).join(''); empty.hidden = items.length > 0; };
  input.addEventListener('input', draw);
  client.from('obras_sociales_public').select('*').order('name').then(({data,error}) => { if (error) { empty.textContent = 'Estamos actualizando el listado. Consultanos por WhatsApp para verificar tu cobertura.'; empty.hidden = false; return; } covers = data || []; draw(); });
  document.querySelectorAll('[data-coverage-whatsapp]').forEach(link => link.addEventListener('click', () => { if (typeof window.gtag === 'function') window.gtag('event', 'click_whatsapp_cobertura', {page_path: location.pathname}); }));
})();
