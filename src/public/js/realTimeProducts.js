const socket = io()

document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.getElementById('product-name').value
    const priceInput = document.getElementById('product-price')
    const price = parseFloat(priceInput.value)
    socket.emit('add-product', { name, price })
    document.getElementById('add-product-form').reset()
})

socket.on('update-products', (products) => {
    const productsList = document.getElementById('products-list')
    productsList.innerHTML = ''
    products.forEach((product) => {
        const li = document.createElement('li')
        li.classList.add('col') 
        const titleDiv = document.createElement('h2')
        titleDiv.textContent = product.name
        li.appendChild(titleDiv)
        const idDiv = document.createElement('div')
        idDiv.textContent = `id: ${product._id}`
        li.appendChild(idDiv)
        const priceDiv = document.createElement('div')
        priceDiv.textContent = `$${product.price}`
        li.appendChild(priceDiv)
        productsList.appendChild(li)
    })
})

document.getElementById('delete-product-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const _id = document.getElementById('delete-product-id').value
    const productId = String(_id)
    if (productId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(productId)) {
        showError('Invalid product ID')
        return
    }
    socket.emit('delete-product', productId)
    document.getElementById('delete-product-form').reset()
})

// Escuchar el evento 'product-not-found' del servidor
socket.on('product-not-found', () => {
    // Mostrar una alerta al usuario
    alert('No se encontró el producto con el ID proporcionado.')
})
