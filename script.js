const cartProducts = document.querySelector('.cart__items');
const buttonClearCart = document.querySelector('.empty-cart');
const totalPrice = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Requisito 5 finalizado com a ajuda do Vinicius de Paula
const cartToArray = () => {
  const productsOnCart = document.querySelectorAll('.cart__item');
  const arrayCartItems = Array.from(productsOnCart);
  return arrayCartItems;
};

const sumPrices = () => {
  const arrayOfProducts = cartToArray();
  let sum = 0;
  arrayOfProducts.forEach((product) => {
    const productsOfArray = product.innerText.split('PRICE: $')[1];
    sum += parseFloat(productsOfArray);
  });
  return sum;
};

const calculatePrices = () => {
  totalPrice.innerText = sumPrices();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCartItems(cartProducts.innerHTML);
  calculatePrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendProductsOnPage = async () => {
  const data = await fetchProducts('computador');
  await data.forEach(({ id, title, thumbnail }) => {
    document.querySelector('.items').appendChild(createProductItemElement({ 
      sku: id, 
      name: title, 
      image: thumbnail,
    }));
  });
};

// Função que adiciona os itens selecionados no carrinho:
const appendProductsToCart = async (ItemID) => {
  const productSelect = ItemID.target.parentNode;
  const sku = getSkuFromProductItem(productSelect);
  const { id, title, price } = await fetchItem(sku);
  const product = createCartItemElement({ sku: id, name: title, salePrice: price });
  cartProducts.appendChild(product);
  // Função que salva itens do carrinho no Local Storage:
  saveCartItems(cartProducts.innerHTML);
  calculatePrices();
};

const refreshPageGetCart = () => {
  const savedLocalStorage = getSavedCartItems();
  cartProducts.innerHTML = savedLocalStorage;
  cartProducts.addEventListener('click', cartItemClickListener);
};

const clearCartProducts = () => {
  cartProducts.innerHTML = '';
  saveCartItems(cartProducts.innerHTML);
  calculatePrices();
};
buttonClearCart.addEventListener('click', clearCartProducts);

const createLoadingMessage = () => {
  const loadingMessage = document.createElement('h1');
  loadingMessage.className = 'loading';
  loadingMessage.innerText = 'carregando...';
  document.querySelector('.items').appendChild(loadingMessage);
};
const removeLoadingMessage = () => document.querySelector('.loading').remove();

window.onload = async () => {
  createLoadingMessage();
  await appendProductsOnPage();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', appendProductsToCart));
  await refreshPageGetCart();
  await getSavedCartItems();
  await removeLoadingMessage();
  calculatePrices();
};
