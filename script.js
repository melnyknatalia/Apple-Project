// Анімація слайдів
const slides = document.querySelectorAll('.slide');
const stages = document.querySelectorAll('.first-slide .stage');
const imagesLeft = document.querySelector('.airpods-left');
const imagesRight = document.querySelector('.airpods-right');

let currentSlide = 0;
let currentStage = 0;
let isScrolling = false;

// Перехід до наступного стейджу з додаванням та видаленням класів
function showNextStage() {
    stages[currentStage]?.classList.remove('active');
    currentStage = (currentStage + 1) % stages.length;
    stages[currentStage]?.classList.add('active');

    if (currentStage === stages.length - 1) {
        clearInterval(stageInterval);
    }
}

let stageInterval = setInterval(showNextStage, 2500);

// Початкова ініціалізація слайдів і зображень
window.addEventListener('load', () => {
    slides[0]?.classList.add('initial');
    setTimeout(() => {
        slides[0]?.classList.add('active');
    }, 20);

    imagesLeft?.classList.add('stage-1');
    imagesRight?.classList.add('stage-1');
});

// Відображення нового слайда зі стилізацією руху
function showSlide(index, direction) {
    slides[currentSlide]?.classList.remove('active');
    slides[currentSlide].style.transform = direction === 'down' ? 'translateY(-100%)' : 'translateY(100%)';
    slides[currentSlide].style.opacity = 0;

    slides[index].style.transform = direction === 'down' ? 'translateY(100%)' : 'translateY(-100%)';
    slides[index].style.opacity = 0;

    setTimeout(() => {
        slides[index].classList.add('active');
        slides[index].style.transform = 'translateY(0)';
        slides[index].style.opacity = 1;
    }, 20);

    currentSlide = index;
}

// Обробка події скролу для переходу між слайдами
function scrollHandler(event) {
    if (isScrolling) return;

    if (event.deltaY > 0 && currentSlide < slides.length - 1) {
        showSlide(currentSlide + 1, 'down');
    } else if (event.deltaY < 0 && currentSlide > 0) {
        showSlide(currentSlide - 1, 'up');
    }

    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

const lastStages = document.querySelectorAll('.last-stage');
let currentLastStage = 0;

// Перехід між останніми стейджами (циклічно)
function showNextLastStage() {
    lastStages[currentLastStage]?.classList.remove('active');
    currentLastStage = (currentLastStage + 1) % lastStages.length;
    lastStages[currentLastStage]?.classList.add('active');
}

let lastStageInterval = setInterval(showNextLastStage, 3000);

document.addEventListener('wheel', () => {
    clearInterval(lastStageInterval);
});

window.addEventListener('wheel', scrollHandler);

// Оновлення слайдера відгуків і управління ним
const slider = document.querySelector('.reviews-slider');
const cards = document.querySelectorAll('.review-card');
let currentIndex = 1;

// Оновлення стану слайдера (позиції та активного відгуку)
function updateSlider() {
    if (!cards[currentIndex]) return;
    cards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentIndex) {
            card.classList.add('active');
        }
    });

    const offset = -(currentIndex - 1) * (cards[currentIndex].offsetWidth + 20);
    slider.style.transform = `translateX(${offset}px)`;
}

// Перехід до наступного відгуку
function nextReview() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateSlider();
}

// Перехід до попереднього відгуку
function prevReview() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateSlider();
}

updateSlider();

// Функції для роботи з кошиком
document.addEventListener('DOMContentLoaded', function () {
    const cartItems = document.getElementById('cart-items');
    const cartModal = document.querySelector('#cart-modal');
    const checkoutModal = document.querySelector('#checkout-modal');
    const cartIcon = document.querySelector('.cart-icon');
    const closeModalButtons = document.querySelectorAll('#cart-modal .close-modal, #checkout-modal .close-modal');
    const checkoutButton = document.querySelector('#checkout-button');
    const checkoutForm = document.getElementById('checkout-form');
    const totalPriceElement = document.getElementById('total-price');

    const products = {
        airpods: {
            title: 'AirPods',
            price: 199,
            img: 'images/MME73 3.png',
        },
        iphone: {
            title: 'iPhone',
            price: 999,
            img: 'images/blue__cevjmd4i0xsi_large_2x-Photoroom.png',
        },
        macbook: {
            title: 'MacBook',
            price: 1299,
            img: 'images/model_mba_m2__cfrbip6c05yq_large_2x.jpg',
        },
    };

    // Управління модальними вікнами (відкрити/закрити)
    function toggleModal(modal, show = true) {
        modal.style.display = show ? 'flex' : 'none';
    }

    cartIcon?.addEventListener('click', () => {
        toggleModal(cartModal, cartModal.style.display !== 'flex');
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.style.display = 'none';
        });
    });

    // Оновлення загальної ціни в кошику
    function updateTotalPrice() {
        let total = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseInt(item.querySelector('.item-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity input').value);
            total += price * quantity;
        });
        totalPriceElement.textContent = `$${total}`;
    }

    // Додавання товару до кошика
    function addItemToCart(product, save = true) {
        const existingItem = cartItems.querySelector(`[data-title="${product.title}"]`);

        if (existingItem) {
            const quantityInput = existingItem.querySelector('.quantity input');
            quantityInput.value = parseInt(quantityInput.value) + 1;
        } else {
            const cartItem = document.createElement('li');
            cartItem.classList.add('cart-item');
            cartItem.setAttribute('data-title', product.title);

            cartItem.innerHTML = `
                <img src="${product.img}" alt="${product.title}">
                <div class="item-info">
                    <h3>${product.title}</h3>
                    <div class="quantity">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" value="1" min="1">
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <p class="item-price">$${product.price}</p>
                <span class="remove">🗑️</span>
            `;

            cartItems.appendChild(cartItem);

            const quantityInput = cartItem.querySelector('input');
            cartItem.querySelector('.increase').addEventListener('click', () => {
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateTotalPrice();
                saveCart();
            });

            cartItem.querySelector('.decrease').addEventListener('click', () => {
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    updateTotalPrice();
                    saveCart();
                }
            });

            cartItem.querySelector('.remove').addEventListener('click', () => {
                cartItem.remove();
                updateTotalPrice();
                saveCart();
            });
        }

        if (save) {
            saveCart();
        }

        updateTotalPrice();
    }

    // Збереження кошика в localStorage
    function saveCart() {
        const cartData = [];
        document.querySelectorAll('.cart-item').forEach(item => {
            const title = item.getAttribute('data-title');
            const price = parseInt(item.querySelector('.item-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity input').value);
            const img = item.querySelector('img').src;
            cartData.push({ title, price, quantity, img });
        });
        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    // Завантаження кошика з localStorage
    function loadCart() {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        savedCart.forEach(item => {
            addItemToCart({ title: item.title, price: item.price, img: item.img }, false);
        });
    }

    //Форма оформлення замовлення
    checkoutButton.addEventListener('click', () => {
        toggleModal(cartModal, false);
        toggleModal(checkoutModal, true);
    });

    // Відправлення форми оформлення замовлення
    checkoutForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        alert(`Thanks for purchase, ${name}! We will contact you by this e-mail: ${email}`);
        toggleModal(checkoutModal, false);
        cartItems.innerHTML = '';
        localStorage.removeItem('cart');
        updateTotalPrice();
    });

    //При натисканні на кнопки доадється товар в корзину
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const productType = e.target.classList[1].split('-')[1];
            if (products[productType]) {
                addItemToCart(products[productType]);
                toggleModal(cartModal, true);
            }
        });
    });

    loadCart();
});