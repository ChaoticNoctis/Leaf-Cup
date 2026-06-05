function loadCart() {
    try {
        const saved = sessionStorage.getItem('leafcup_cart')
        return saved ? JSON.parse(saved) : []
    } catch { return [] }
}

function saveCart(cart) {
    try { sessionStorage.setItem('leafcup_cart', JSON.stringify(cart)) } catch {}
}

function getCart() { return loadCart() }

function addToCart(productId, name, price, image, qty = 1) {
    const cart = loadCart()
    const existing = cart.find(i => i.productId === productId)
    if (existing) {
        existing.qty += qty
    } else {
        cart.push({ productId, name, price, image, qty })
    }
    saveCart(cart)
    updateCartBadge()
    showToast('«' + name + '» добавлен в корзину')
}

function removeFromCart(productId) {
    saveCart(loadCart().filter(i => i.productId !== productId))
    updateCartBadge()
}

function updateQty(productId, qty) {
    const cart = loadCart()
    const item = cart.find(i => i.productId === productId)
    if (item) { item.qty = Math.max(1, qty); saveCart(cart) }
    updateCartBadge()
}

function clearCart() {
    saveCart([])
    updateCartBadge()
}

function getCartTotal() {
    return loadCart().reduce((sum, i) => sum + i.price * i.qty, 0)
}

function getCartCount() {
    return loadCart().reduce((sum, i) => sum + i.qty, 0)
}

function updateCartBadge() {
    const badge = document.getElementById('cartCount')
    if (!badge) return
    const count = getCartCount()
    badge.textContent = count
    badge.style.display = count > 0 ? 'inline-block' : 'none'
}

function showToast(message) {
    let container = document.getElementById('toastContainer')
    if (!container) {
        container = document.createElement('div')
        container.id = 'toastContainer'
        container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;'
        document.body.appendChild(container)
    }
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = 'background:#596b3c;color:#fff;padding:12px 20px;border-radius:8px;font-size:14px;font-family:Montserrat,sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.2);'
    container.appendChild(toast)
    setTimeout(() => { toast.style.opacity='0'; toast.style.transition='opacity .4s'; setTimeout(()=>toast.remove(),400) }, 2500)
}
