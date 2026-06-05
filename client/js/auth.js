let currentUser = null

// При загрузке страницы пробуем получить профиль с сервера
async function restoreSession() {
    try {
        currentUser = await UserAPI.getMe()
    } catch {
        currentUser = null
    }
    initHeader()
}

async function login() {
    const email = document.getElementById('loginEmail').value.trim()
    const pass  = document.getElementById('loginPassword').value
    const errEl = document.getElementById('loginError')
    errEl.classList.add('d-none')

    if (!email || !pass) {
        errEl.textContent = 'Заполните все поля'
        errEl.classList.remove('d-none')
        return
    }
    try {
        currentUser = await UserAPI.login(email, pass)
        const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'))
        if (modal) modal.hide()
        initHeader()
    } catch(e) {
        errEl.textContent = e.message
        errEl.classList.remove('d-none')
    }
}

async function register() {
    const name  = document.getElementById('regName').value.trim()
    const email = document.getElementById('regEmail').value.trim()
    const pass  = document.getElementById('regPassword').value
    const errEl = document.getElementById('regError')
    const okEl  = document.getElementById('regSuccess')
    errEl.classList.add('d-none')
    okEl.classList.add('d-none')

    if (!name || !email || !pass) {
        errEl.textContent = 'Заполните все поля'
        errEl.classList.remove('d-none')
        return
    }
    try {
        currentUser = await UserAPI.register(email, name, pass)
        okEl.textContent = 'Регистрация успешна! Добро пожаловать, ' + currentUser.full_name + '!'
        okEl.classList.remove('d-none')
        setTimeout(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('authModal'))
            if (modal) modal.hide()
            initHeader()
        }, 1200)
    } catch(e) {
        errEl.textContent = e.message
        errEl.classList.remove('d-none')
    }
}

async function logout() {
    try { await UserAPI.logout() } catch {}
    currentUser = null
    initHeader()
    if (window.location.pathname.includes('account') ||
        window.location.pathname.includes('admin')) {
        window.location.href = '/'
    }
}

function switchTab(tab) {
    document.getElementById('loginForm').style.display    = tab === 'login'    ? '' : 'none'
    document.getElementById('registerForm').style.display = tab === 'register' ? '' : 'none'
    document.getElementById('loginTab').classList.toggle('active', tab === 'login')
    document.getElementById('registerTab').classList.toggle('active', tab === 'register')
}

function initHeader() {
    const authBtn   = document.getElementById('authBtn')
    const userMenu  = document.getElementById('userMenu')
    const nameSpan  = document.getElementById('userNameHeader')
    const adminItem = document.getElementById('adminMenuItem')
    if (currentUser) {
        if (authBtn)  authBtn.style.display  = 'none'
        if (userMenu) userMenu.style.display = ''
        if (nameSpan) nameSpan.textContent   = currentUser.full_name
        if (adminItem) adminItem.style.display = currentUser.role === 'admin' ? '' : 'none'
    } else {
        if (authBtn)  authBtn.style.display  = ''
        if (userMenu) userMenu.style.display = 'none'
    }
}

function requireAuth() {
    if (!currentUser) {
        alert('Пожалуйста, войдите в аккаунт')
        window.location.href = '/'
        return false
    }
    return true
}

function requireAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Доступ запрещён')
        window.location.href = '/'
        return false
    }
    return true
}
