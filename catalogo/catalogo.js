const PRODUCTS_API_URL = './api/products';
const PRODUCTS_FALLBACK_URL = './data/products.json';
const WA_NUMBER = '5491132016039';

const KNOWN_DRIVE_IMAGE_IDS = {
  'set bandas tela (x3).png': '1CK4ub-WBmYa4mGUSj72r0TGDY6swgyHg',
  'set bandas tela (x3)': '1CK4ub-WBmYa4mGUSj72r0TGDY6swgyHg',
  'bandas (x5).png': '1SKtjaf0zOzXBa_gQecfuXvNQFtmVXcBj',
  'bandas (x5)': '1SKtjaf0zOzXBa_gQecfuXvNQFtmVXcBj',
  'tirabandas azul.png': '1fAvuXT9tPhzSeFZSA-8gHSIJ0dsrHz92',
  'tirabandas azul': '1fAvuXT9tPhzSeFZSA-8gHSIJ0dsrHz92',
  'hand grip.png': '15_dcqfrUK90SFaCRKD7YNkjgCfwpYFKe',
  'hand grip': '15_dcqfrUK90SFaCRKD7YNkjgCfwpYFKe',
  'mini bozu.png': '17WdJslI-fqJ80qCpmwaKdrM2tUO2u83U',
  'mini bozu': '17WdJslI-fqJ80qCpmwaKdrM2tUO2u83U',
  'pelotas masaje.png': '1s6oE-Wl7zzGKFKj1mCAWm2Jgm5t9vECc',
  'pelotas masaje': '1s6oE-Wl7zzGKFKj1mCAWm2Jgm5t9vECc',
  'banda circula tela verde 60lb 74*8cm.png': '1NoSE3Tnb5MW4vUJjqu0py8nf4__uYZG-',
  'banda circula tela verde 60lb 74*8cm': '1NoSE3Tnb5MW4vUJjqu0py8nf4__uYZG-',
  'banda circula tela rosa 90lb 74*8cm.png': '1073t5_zHQ9znTT-0h2pfapDP0RiJVuIU',
  'banda circula tela rosa 90lb 74*8cm': '1073t5_zHQ9znTT-0h2pfapDP0RiJVuIU',
  'banda circula tela violeta 120lb 74*8cm.png': '1F7Yde605eiKtKYsO8lCeGnvnzO35Jv9f',
  'banda circula tela violeta 120lb 74*8cm': '1F7Yde605eiKtKYsO8lCeGnvnzO35Jv9f',
};

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

const normalizeKey = (value) => String(value || '').trim().toLowerCase();

const getDriveIdFromString = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  const idMatch = trimmed.match(/(?:\/file\/d\/|[?&]id=)([a-zA-Z0-9_-]{20,})/);
  if (idMatch) return idMatch[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  return null;
};

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
      '<rect width="400" height="300" fill="#f2f4f8"/>' +
      '<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="#8a8f9f" font-family="Arial, Helvetica, sans-serif">Imagen no disponible</text>' +
    '</svg>'
  );

const buildDriveImageUrl = (id) => `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`;
const buildDriveImageProxyUrl = (id) => `./api/drive-image?id=${encodeURIComponent(id)}`;
const buildDriveDownloadUrl = (id) => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;

function getImageSrc(product) {
  const image = String(product.image || '').trim();
  if (!image) return { src: null, driveId: null };

  if (image.startsWith('http://') || image.startsWith('https://')) {
    const driveId = getDriveIdFromString(image);
    return { src: image, driveId: driveId || null };
  }

  const driveId = getDriveIdFromString(image);
  if (driveId) {
    return { src: buildDriveImageUrl(driveId), driveId };
  }

  const knownId = KNOWN_DRIVE_IMAGE_IDS[normalizeKey(image)] || KNOWN_DRIVE_IMAGE_IDS[normalizeKey(product.name)] || KNOWN_DRIVE_IMAGE_IDS[normalizeKey(product.description)];
  if (knownId) {
    return { src: buildDriveImageUrl(knownId), driveId: knownId };
  }

  return { src: `./images/${encodeURIComponent(image)}`, driveId: null };
}

function handleImageError(event) {
  const img = event.target;
  if (!img || img.dataset.retry === '1') return;

  img.dataset.retry = '1';
  const driveId = img.dataset.driveId;

  if (driveId) {
    img.src = buildDriveImageProxyUrl(driveId);
    return;
  }

  if (img.src.includes('export=view')) {
    img.src = img.src.replace('export=view', 'export=download');
    return;
  }

  img.src = FALLBACK_IMAGE;
}

const state = {
  products: [],
  cart: []
};

const elements = {
  products: document.getElementById('products'),
  search: document.getElementById('search'),
  sort: document.getElementById('sort'),
  cartItems: document.getElementById('cart-items'),
  totalCash: document.getElementById('total-cash'),
  totalTransfer: document.getElementById('total-transfer'),
  checkout: document.getElementById('checkout')
};

const loadProducts = async () => {
  const sources = [PRODUCTS_API_URL, PRODUCTS_FALLBACK_URL];

  for (const source of sources) {
    try {
      const response = await fetch(source);
      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        state.products = data;
        return;
      }
    } catch (error) {
      console.warn(`No se pudo cargar el catálogo desde ${source}:`, error);
    }
  }

  state.products = [];
};

const getFilteredProducts = () => {
  const filter = elements.search.value.trim().toLowerCase();
  const sortKey = elements.sort.value;

  return state.products
    .filter((product) => {
      if (!filter) return true;
      return [product.name, product.description].some((field) =>
        String(field).toLowerCase().includes(filter)
      );
    })
    .slice()
    .sort((a, b) => {
      if (sortKey === 'name-asc') return a.name.localeCompare(b.name);
      if (sortKey === 'name-desc') return b.name.localeCompare(a.name);
      if (sortKey === 'price-asc') return a.cashPrice - b.cashPrice;
      if (sortKey === 'price-desc') return b.cashPrice - a.cashPrice;
      return 0;
    });
};

const findCartItem = (productId) => state.cart.find((item) => item.id === productId);

const updateCart = () => {
  elements.cartItems.innerHTML = '';

  state.cart.forEach((item) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';

    cartItem.innerHTML = `
      <div class="cart-item-header">
        <div>
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">${formatPrice(item.cashPrice)} · Cantidad ${item.quantity}</div>
        </div>
        <button class="quantity-button" type="button" data-action="remove" data-id="${item.id}">-</button>
      </div>
    `;

    elements.cartItems.appendChild(cartItem);
  });

  const totalCash = state.cart.reduce((sum, item) => sum + item.cashPrice * item.quantity, 0);
  const totalTransfer = state.cart.reduce((sum, item) => sum + item.transferPrice * item.quantity, 0);

  elements.totalCash.textContent = formatPrice(totalCash);
  elements.totalTransfer.textContent = formatPrice(totalTransfer);
  elements.checkout.disabled = state.cart.length === 0;
};

const addToCart = (productId) => {
  const product = state.products.find((item) => item.id === productId);
  if (!product || product.stock <= 0) return;

  const existing = findCartItem(productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ ...product, quantity: 1 });
  }

  updateCart();
};

const removeFromCart = (productId) => {
  const existing = findCartItem(productId);
  if (!existing) return;

  existing.quantity -= 1;
  if (existing.quantity <= 0) {
    state.cart = state.cart.filter((item) => item.id !== productId);
  }

  updateCart();
};

const renderProducts = () => {
  const items = getFilteredProducts();

  elements.products.innerHTML = items
    .map((product) => {
      const imageData = getImageSrc(product);
      const imageSrc = imageData.src;
      const driveId = imageData.driveId;

      return `
        <article class="product-card">
          <div class="product-image">
            ${imageSrc ? `<img src="${imageSrc}" alt="${product.name}" loading="lazy" data-drive-id="${driveId || ''}" onerror="handleImageError(event)">` : `<span>${product.name}</span>`}
          </div>
          <div>
            <h2 class="product-title">${product.name}</h2>
            <p class="product-description">${product.description}</p>
            <div class="product-meta">
              <span class="product-price">${formatPrice(product.cashPrice)}</span>
              <span class="product-stock">Stock ${product.stock}</span>
            </div>
          </div>
          <div class="product-actions">
            <button class="action-button" type="button" data-action="add" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>Agregar</button>
            <div class="quantity-controls">
              <span class="quantity-value">${product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
};

const sendOrderToWhatsapp = () => {
  if (state.cart.length === 0) return;

  const lines = [
    'Hola, quiero hacer un pedido desde el catálogo de Kareh.',
    '',
    'Productos:'
  ];

  state.cart.forEach((item) => {
    lines.push(`- ${item.name} x${item.quantity} | ${formatPrice(item.cashPrice)} cada uno`);
  });

  const totalCash = state.cart.reduce((sum, item) => sum + item.cashPrice * item.quantity, 0);
  const totalTransfer = state.cart.reduce((sum, item) => sum + item.transferPrice * item.quantity, 0);

  lines.push('');
  lines.push(`Total efectivo: ${formatPrice(totalCash)}`);
  lines.push(`Total transferencia: ${formatPrice(totalTransfer)}`);
  lines.push('');
  lines.push('Por favor indicame disponibilidad, forma de pago y envío. Gracias.');

  const text = encodeURIComponent(lines.join('\n'));
  window.location.href = `https://wa.me/${WA_NUMBER}?text=${text}`;
};

const handleProductAction = (event) => {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;

  if (!action || !id) return;

  if (action === 'add') {
    addToCart(id);
  }
};

const handleCartAction = (event) => {
  const action = event.target.dataset.action;
  const id = event.target.dataset.id;

  if (!action || !id) return;

  if (action === 'remove') {
    removeFromCart(id);
  }
};

const init = async () => {
  await loadProducts();
  renderProducts();
  updateCart();

  elements.search.addEventListener('input', renderProducts);
  elements.sort.addEventListener('change', renderProducts);
  elements.products.addEventListener('click', handleProductAction);
  elements.cartItems.addEventListener('click', handleCartAction);
  elements.checkout.addEventListener('click', sendOrderToWhatsapp);
};

window.addEventListener('DOMContentLoaded', init);
