// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Función para verificar estado de login
function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const loginLink = document.getElementById('loginLink');
    const userInfo = document.getElementById('userInfo');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (loginLink && userInfo) {
        if (currentUser) {
            const user = JSON.parse(currentUser);
            loginLink.style.display = 'none';
            userInfo.style.display = 'inline';
            document.getElementById('userName').textContent = `Hola, ${user.name}!`;
            
            // Habilitar botón de compra
            if (checkoutBtn) {
                checkoutBtn.disabled = false;
                checkoutBtn.style.opacity = '1';
                checkoutBtn.style.cursor = 'pointer';
                checkoutBtn.title = '';
            }
        } else {
            loginLink.style.display = 'inline';
            userInfo.style.display = 'none';
            
            // Deshabilitar botón de compra
            if (checkoutBtn) {
                checkoutBtn.disabled = true;
                checkoutBtn.style.opacity = '0.5';
                checkoutBtn.style.cursor = 'not-allowed';
                checkoutBtn.title = 'Debes iniciar sesión para comprar';
            }
        }
    }
}

// Función para cerrar sesión
function logout(event) {
    event.preventDefault();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedEmail');
    checkLoginStatus();
    alert('Sesión cerrada correctamente');
}

// Función para añadir productos al carrito
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification(`${name} añadido al carrito`);
}

// Función para actualizar la UI del carrito
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartTotalContainer = document.getElementById('cartTotalContainer');
    const cartTotal = document.getElementById('cartTotal');

    // Contar total de items
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Limpiar contenedor
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartTotalContainer.style.display = 'none';
        return;
    }

    cartEmpty.style.display = 'none';
    cartTotalContainer.style.display = 'block';

    // Mostrar items
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        cartItems.appendChild(itemElement);
    });

    // Actualizar total
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Función para aumentar cantidad
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Función para disminuir cantidad
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            removeFromCart(id);
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }
}

// Función para eliminar producto
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification('Producto eliminado del carrito');
}

// Función para mostrar/ocultar carrito
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
    updateCartUI();
    checkLoginStatus(); // Actualizar estado del botón de compra
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para proceder al pago
function checkout() {
    // Verificar si el usuario está logueado
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        showNotification('Debes iniciar sesión para comprar');
        setTimeout(() => {
            window.location.href = 'login.html?redirectTo=checkout';
        }, 1500);
        return;
    }

    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Redirigir a la página de pago
    window.location.href = 'checkout.html';
}

// Inicializar UI
updateCartUI();
checkLoginStatus();
