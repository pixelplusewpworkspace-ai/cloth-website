document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // --- Elements ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartPanel = document.getElementById('cart-panel');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartCountHeader = document.getElementById('cart-count-header');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const navbar = document.getElementById('navbar');

    // --- Mobile Menu ---
    function toggleMobileMenu() {
        const isClosed = mobileMenu.classList.contains('-translate-x-full');
        if (isClosed) {
            mobileMenu.classList.remove('-translate-x-full');
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenu.classList.add('-translate-x-full');
            document.body.style.overflow = '';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    closeMenuBtn.addEventListener('click', toggleMobileMenu);

    // --- Cart Sidebar ---
    function toggleCart() {
        const isClosed = cartPanel.classList.contains('translate-x-full');
        if (isClosed) {
            cartSidebar.classList.remove('pointer-events-none');
            cartBackdrop.classList.remove('opacity-0');
            cartPanel.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        } else {
            cartSidebar.classList.add('pointer-events-none');
            cartBackdrop.classList.add('opacity-0');
            cartPanel.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }
    }

    cartBtn.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);
    cartBackdrop.addEventListener('click', toggleCart);

    // --- Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-brand-black/95', 'shadow-md');
        } else {
            navbar.classList.remove('bg-brand-black/95', 'shadow-md');
        }
    });

    // --- Cart Logic ---
    function updateCartUI() {
        // Update counts
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCountHeader.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.classList.remove('hidden');
        } else {
            cartCount.classList.add('hidden');
        }

        // Calculate Subtotal
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

        // Render Items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center mt-10">Your cart is empty.</p>';
            return;
        }

        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'flex gap-4 items-start animate-fade-in-up';
            // Slight delay for list items
            itemElement.style.animationDelay = `${index * 50}ms`;
            
            itemElement.innerHTML = `
                <div class="h-24 w-20 flex-shrink-0 overflow-hidden rounded border border-white/10 relative">
                     <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover object-center">
                </div>
                <div class="flex flex-1 flex-col">
                    <div>
                        <div class="flex justify-between text-base font-medium text-white">
                            <h3>${item.name}</h3>
                            <p class="ml-4">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <p class="mt-1 text-sm text-gray-500">Size: L</p> <!-- Hardcoded size for demo -->
                    </div>
                    <div class="flex flex-1 items-end justify-between text-sm">
                        <div class="flex items-center border border-white/20 rounded">
                            <button class="px-2 py-1 hover:bg-white/10 transition-colors btn-decrease" data-id="${item.id}">-</button>
                            <span class="px-2 text-white">${item.quantity}</span>
                            <button class="px-2 py-1 hover:bg-white/10 transition-colors btn-increase" data-id="${item.id}">+</button>
                        </div>
                        <button type="button" class="font-medium text-brand-accent hover:text-red-400 btn-remove" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Add event listeners for dynamic elements
        document.querySelectorAll('.btn-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, -1));
        });
        document.querySelectorAll('.btn-increase').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 1));
        });
        document.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', (e) => removeFromCart(e.target.dataset.id));
        });
    }

    function addToCart(product) {
        const existingItemIndex = cart.findIndex(item => item.id === product.id);
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        saveCart();
        updateCartUI();
        
        // Open cart to show feedback
        if (cartPanel.classList.contains('translate-x-full')) {
            toggleCart();
        }
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    function updateQuantity(id, change) {
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                removeFromCart(id);
            } else {
                saveCart();
                updateCartUI();
            }
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // --- Add to Cart Buttons ---
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', () => {
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseFloat(button.dataset.price),
                image: button.dataset.image
            };
            addToCart(product);
        });
    });

    // Initial render
    updateCartUI();
});
