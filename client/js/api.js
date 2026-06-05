const API_BASE = ''

async function apiFetch(path, options = {}) {
    const res = await fetch('/api' + path, {
        credentials: 'include',  // отправляем cookie с каждым запросом
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
    })
    const text = await res.text()
    if (!res.ok) throw new Error(text || 'Ошибка сервера')
    try { return JSON.parse(text) } catch { return text }
}

const UserAPI = {
    register: (email, full_name, password) =>
        apiFetch('/user/register', { method: 'POST', body: JSON.stringify({ email, full_name, password }) }),
    login: (email, password) =>
        apiFetch('/user/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    logout: () =>
        apiFetch('/user/logout', { method: 'POST' }),
    getMe: () => apiFetch('/user/me'),
    updateMe: (full_name) =>
        apiFetch('/user/me', { method: 'PATCH', body: JSON.stringify({ full_name }) }),
    getAll: () => apiFetch('/user/all'),
}

const ProductAPI = {
    list: (params = {}) => {
        const q = new URLSearchParams()
        if (params.category_id) q.set('category_id', params.category_id)
        if (params.search)      q.set('search', params.search)
        return apiFetch('/product?' + q.toString())
    },
    get: (id)    => apiFetch('/product/' + id),
    categories:  () => apiFetch('/product/categories'),
    create: (data) => apiFetch('/product', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => apiFetch('/product/' + id, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => apiFetch('/product/' + id, { method: 'DELETE' }),
}

const OrderAPI = {
    create: (address, payment, items) =>
        apiFetch('/order', { method: 'POST', body: JSON.stringify({ address, payment, items }) }),
    getMy:  () => apiFetch('/order/my'),
    getAll: () => apiFetch('/order/all'),
    updateStatus: (id, status) =>
        apiFetch('/order/' + id + '/status', { method: 'PATCH', body: JSON.stringify({ status }) }),
}
