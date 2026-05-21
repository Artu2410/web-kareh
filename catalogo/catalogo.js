const PRODUCTS_URL = './data/products.json';
const WA_NUMBER = '5491132016039';

const formatPrice = (value) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
};

const getImageSrc = (product) => {
  if (!product.image) return null;
  const image = String(product.image).trim();

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.includes('drive.google.com')) {
    if (image.includes('/file/d/')) {
      const id = image.split('/file/d/')[1]?.split('/')[0];
      return id ? `https://drive.google.com/uc?export=view&id=${id}` : null;
    }
    const idMatch = image.match(/id=([a-zA-Z0-9_-]+)/);
    return idMatch ? `https://drive.google.com/uc?export=view&id=${idMatch[1]}` : null;
  }

  return `./images/${encodeURIComponent(image)}`;
};

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
  try {
    const response = await fetch(PRODUCTS_URL);
    state.products = await response.json();
  } catch (error) {
    console.error('No se pudo cargar el catálogo:', error);
    state.products = [];
  }
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
      const imageSrc = getImageSrc(product);
      return `
        <article class="product-card">
          <div class="product-image">
            ${imageSrc ? `<img src="${imageSrc}" alt="${product.name}" loading="lazy">` : `<span>${product.name}</span>`}
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
