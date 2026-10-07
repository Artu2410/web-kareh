(() => {
  const config = window.KAREH_SUPABASE_CONFIG || {};
  const configured = config.url && config.anonKey;
  const message = document.querySelector('#message');
  const showMessage = (text) => { if (message) message.textContent = text; };
  if (!configured) { showMessage('Falta configurar Supabase. Consultá SUPABASE_SETUP.md.'); return; }
  const client = window.supabase.createClient(config.url, config.anonKey, { auth: { flowType: 'pkce' } });
  const adminEmail = 'centrokareh@gmail.com';
  const loginForm = document.querySelector('#login-form');
  const isLogin = Boolean(loginForm);

  const signOut = async () => { await client.auth.signOut(); location.assign('./login/'); };
  const requireAdmin = async () => {
    const { data: { user } } = await client.auth.getUser();
    if (!user) { location.assign(isLogin ? './' : './login/'); return null; }
    const { data } = await client.from('profiles').select('role, username').eq('id', user.id).maybeSingle();
    if (!data || data.role !== 'admin') { await signOut(); return null; }
    return user;
  };

  if (isLogin) {
    const next = new URLSearchParams(location.search).get('next');
    // Only permit simple, same-site paths; never trust an arbitrary redirect target.
    const destination = next && /^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(next) ? next : '../';
    let recoveryMode = false;
    client.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') { recoveryMode = true; loginForm.classList.add('hidden'); document.querySelector('#new-password-form').classList.remove('hidden'); } });
    client.auth.getUser().then(({ data }) => { if (data.user && !recoveryMode) location.assign(destination); });
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault(); showMessage('');
      const username = document.querySelector('#username').value.trim().toLowerCase();
      if (username !== 'kinesiologiakareh') { showMessage('Usuario o contraseña incorrectos.'); return; }
      const { error } = await client.auth.signInWithPassword({ email: adminEmail, password: document.querySelector('#password').value });
      if (error) { showMessage('Usuario o contraseña incorrectos.'); return; }
      const { data: { user } } = await client.auth.getUser();
      const { data: profile } = await client.from('profiles').select('role').eq('id', user.id).maybeSingle();
      if (!profile || profile.role !== 'admin') { await client.auth.signOut(); showMessage('No tenés autorización para acceder al panel.'); return; }
      location.assign(destination);
    });
    document.querySelector('#reset').addEventListener('click', async () => {
      await client.auth.resetPasswordForEmail(adminEmail, { redirectTo: `${location.origin}/admin/login/` });
      showMessage('Si la cuenta existe, enviamos las instrucciones de recuperación al correo administrativo.');
    });
    document.querySelector('#new-password-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const { error } = await client.auth.updateUser({ password: document.querySelector('#new-password').value });
      if (error) { showMessage('No se pudo actualizar la contraseña. Solicitá un nuevo enlace.'); return; }
      showMessage('Contraseña actualizada. Ya podés iniciar sesión.');
      await client.auth.signOut();
      document.querySelector('#new-password-form').classList.add('hidden'); loginForm.classList.remove('hidden');
    });
    return;
  }

  const list = document.querySelector('#coverage-list');
  const form = document.querySelector('#coverage-form');
  let covers = [];
  const escapeHtml = (value = '') => value.replace(/[&<>'"]/g, char => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[char]);
  const render = () => {
    const term = document.querySelector('#search').value.trim().toLocaleLowerCase();
    const filtered = covers.filter(item => item.name.toLocaleLowerCase().includes(term));
    list.innerHTML = filtered.length ? filtered.map(item => `<article class="coverage-row"><strong>${escapeHtml(item.name)}</strong><span class="status ${item.active ? 'active' : 'inactive'}">${item.active ? '● Activa' : '● Inactiva'}</span><span class="actions"><button class="secondary" data-edit="${item.id}">Editar</button> <button class="secondary" data-toggle="${item.id}">${item.active ? 'Desactivar' : 'Activar'}</button></span></article>`).join('') : '<p>No hay obras sociales que coincidan.</p>';
    document.querySelector('#total').textContent = covers.length;
    document.querySelector('#active-total').textContent = covers.filter(item => item.active).length;
    document.querySelector('#inactive-total').textContent = covers.filter(item => !item.active).length;
  };
  const load = async () => { const { data, error } = await client.from('obras_sociales').select('*').order('name'); if (error) { showMessage('No se pudo cargar el listado.'); return; } covers = data; render(); };
  const openForm = (item) => { form.reset(); document.querySelector('#coverage-id').value = item?.id || ''; document.querySelector('#form-title').textContent = item ? 'Editar obra social' : 'Nueva obra social'; ['name','logo_url','official_url','description'].forEach(key => document.querySelector(`#${key}`).value = item?.[key] || ''); document.querySelector('#active').value = String(item?.active ?? true); form.classList.remove('hidden'); document.querySelector('#name').focus(); };
  requireAdmin().then(user => { if (user) load(); });
  document.querySelector('#logout').addEventListener('click', signOut);
  document.querySelector('#search').addEventListener('input', render);
  document.querySelector('#new-coverage').addEventListener('click', () => openForm());
  document.querySelector('#cancel').addEventListener('click', () => form.classList.add('hidden'));
  list.addEventListener('click', async event => { const id = event.target.dataset.edit || event.target.dataset.toggle; if (!id) return; const item = covers.find(coverage => coverage.id === id); if (event.target.dataset.edit) { openForm(item); return; } const { error } = await client.from('obras_sociales').update({ active: !item.active }).eq('id', id); if (error) showMessage('No se pudo actualizar el estado.'); else load(); });
  form.addEventListener('submit', async event => { event.preventDefault(); showMessage(''); const id = document.querySelector('#coverage-id').value; const data = { name: document.querySelector('#name').value.trim(), active: document.querySelector('#active').value === 'true', logo_url: document.querySelector('#logo_url').value.trim() || null, official_url: document.querySelector('#official_url').value.trim() || null, description: document.querySelector('#description').value.trim() || null }; const file = document.querySelector('#logo_file').files[0]; if (file) { if (!file.type.startsWith('image/') || file.size > 2097152) { showMessage('El logo debe ser una imagen de hasta 2 MB.'); return; } const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g, '-'); const path = `logos/${crypto.randomUUID()}-${safeName}`; const { error: uploadError } = await client.storage.from('coverage-logos').upload(path, file, { cacheControl: '3600', upsert: false }); if (uploadError) { showMessage('No se pudo cargar el logo. Confirmá la migración de Storage.'); return; } data.logo_url = client.storage.from('coverage-logos').getPublicUrl(path).data.publicUrl; } const request = id ? client.from('obras_sociales').update(data).eq('id', id) : client.from('obras_sociales').insert(data); const { error } = await request; if (error) { showMessage(error.code === '23505' ? 'Ya existe una obra social con ese nombre.' : 'No se pudo guardar. Revisá los datos.'); return; } form.classList.add('hidden'); load(); });
})();
