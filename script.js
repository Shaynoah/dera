// Sample products data with mock images
const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        description: "Premium cotton t-shirt with modern fit. Perfect for everyday wear.",
        price: 2500,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop"
    },
    {
        id: 2,
        name: "Designer Jeans",
        description: "Stylish denim jeans with perfect fit. Made from high-quality fabric.",
        price: 4500,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop"
    },
    {
        id: 3,
        name: "Hoodie",
        description: "Comfortable and warm hoodie for casual occasions. Available in multiple colors.",
        price: 3500,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop"
    },
    {
        id: 4,
        name: "Sneakers",
        description: "Trendy sneakers that combine style and comfort. Perfect for any outfit.",
        price: 5500,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop"
    },
    {
        id: 5,
        name: "Baseball Cap",
        description: "Classic baseball cap with embroidered logo. Adjustable fit for all sizes.",
        price: 1500,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=600&fit=crop"
    },
    {
        id: 6,
        name: "Jacket",
        description: "Stylish jacket for all seasons. Lightweight yet warm and durable.",
        price: 6000,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop"
    },
    {
        id: 7,
        name: "Shorts",
        description: "Comfortable shorts perfect for summer. Made from breathable fabric.",
        price: 2000,
        image: "https://images.unsplash.com/photo-1506629905607-0c0a2c0c0a2c?w=600&h=600&fit=crop"
    },
    {
        id: 8,
        name: "Polo Shirt",
        description: "Classic polo shirt for a smart casual look. Premium quality material.",
        price: 3000,
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600&h=600&fit=crop"
    }
];

// Cart state
let cart = JSON.parse(localStorage.getItem('deraDripCart')) || [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const orderModal = document.getElementById('orderModal');
const closeModal = document.getElementById('closeModal');
const orderForm = document.getElementById('orderForm');
const orderSummary = document.getElementById('orderSummary');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    initScrollAnimations();
    initParallax();
    initNavbarScroll();
    initImageZoom();
});

// Setup event listeners
function setupEventListeners() {
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', openOrderModal);
    closeModal.addEventListener('click', closeOrderModal);
    orderForm.addEventListener('submit', handleOrderSubmit);
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Close cart when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            closeOrderModal();
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                navMenu.classList.remove('active');
            }
        });
    });

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('#products').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
}

// Render products
function renderProducts() {
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-aos', 'fade-up');
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" onload="this.classList.add('loaded')">
            <div class="product-overlay">
                <button class="quick-view-btn" onclick="quickView(${product.id})">
                    <i class="fas fa-eye"></i> Quick View
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">KSh ${product.price.toLocaleString()}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <span class="btn-text">Add to Cart</span>
                <i class="fas fa-shopping-cart btn-icon"></i>
            </button>
        </div>
    `;
    return card;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    
    // Animate cart button
    cartBtn.style.animation = 'none';
    setTimeout(() => {
        cartBtn.style.animation = 'cartPulse 0.5s ease';
    }, 10);
    
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showNotification('Item removed from cart');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
    } else {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItems.appendChild(cartItem);
        });
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString();
}

// Create cart item
function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">KSh ${(item.price * item.quantity).toLocaleString()}</div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return div;
}

// Toggle cart
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

// Open order modal
function openOrderModal() {
    if (cart.length === 0) return;

    // Build order summary
    let summaryHTML = '<h3 style="margin-bottom: 1rem;">Order Summary</h3>';
    cart.forEach(item => {
        summaryHTML += `
            <div class="order-summary-item">
                <span>${item.name} x${item.quantity}</span>
                <span>KSh ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    summaryHTML += `
        <div class="order-summary-item" style="font-weight: bold; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 2px solid #333;">
            <span>Total</span>
            <span>KSh ${total.toLocaleString()}</span>
        </div>
    `;
    orderSummary.innerHTML = summaryHTML;

    orderModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close order modal
function closeOrderModal() {
    orderModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Handle order submit
function handleOrderSubmit(e) {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;

    // Build order message
    let orderMessage = `*New Order from Dera Drip Website*\n\n`;
    orderMessage += `*Customer Details:*\n`;
    orderMessage += `Name: ${customerName}\n`;
    orderMessage += `Phone: ${customerPhone}\n`;
    orderMessage += `Address: ${customerAddress}\n\n`;
    orderMessage += `*Order Items:*\n`;
    
    cart.forEach(item => {
        orderMessage += `${item.name} x${item.quantity} - KSh ${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderMessage += `\n*Total: KSh ${total.toLocaleString()}*`;

    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(orderMessage);
    const whatsappUrl = `https://wa.me/254700456049?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    
    // Close modal and reset form
    closeOrderModal();
    orderForm.reset();
    
    // Close cart
    toggleCart();

    showNotification('Order placed successfully! Check WhatsApp for confirmation.', 'success');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('deraDripCart', JSON.stringify(cart));
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#ff6b6b'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections, product cards, and contact cards
    document.querySelectorAll('section, .product-card, .contact-card').forEach(el => {
        observer.observe(el);
    });

    // Observe section titles separately
    document.querySelectorAll('.section-title').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect for hero section
function initParallax() {
    const heroBackground = document.querySelector('.hero-background');
    if (!heroBackground) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroBackground.style.transform = `translateY(${rate}px) scale(1.05)`;
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// Image zoom effect on hover
function initImageZoom() {
    document.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('product-image')) {
            e.target.style.transform = 'scale(1.1)';
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.classList.contains('product-image')) {
            e.target.style.transform = 'scale(1)';
        }
    });
}

// Quick view function
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Create quick view modal
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <span class="close-quick-view">&times;</span>
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-info">
                <h2>${product.name}</h2>
                <p class="quick-view-description">${product.description}</p>
                <div class="quick-view-price">KSh ${product.price.toLocaleString()}</div>
                <button class="btn btn-primary" onclick="addToCart(${product.id}); closeQuickView();">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    modal.querySelector('.close-quick-view').addEventListener('click', () => {
        closeQuickView();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeQuickView();
        }
    });
}

function closeQuickView() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Add ripple effect to buttons
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn') || e.target.closest('.btn')) {
        const button = e.target.classList.contains('btn') ? e.target : e.target.closest('.btn');
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.quickView = quickView;
window.closeQuickView = closeQuickView;
