document.addEventListener('DOMContentLoaded', () => {
    const cartId = document.getElementById('cartId').value
    const addButtonList = document.querySelectorAll('.btnAdd')

    addButtonList.forEach(button => {
        button.addEventListener('click', async (event) => {
            const productId = event.target.dataset.productId
            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                })
                if (!response.ok) {
                    throw new Error('Error al agregar el producto al carrito')
                }
                const cart = await response.json()
                Toastify({
                    text: 'Ítem agregado al carrito',
                    duration: 3000,
                    gravity: "bottom"
                }).showToast()
                updateCartView(cart)
            } catch (error) {
                console.error(error)
            }
        })
    })
})

async function updateCartView(cart) {
    const cartContainer = document.querySelector('.cartProducts')
    cartContainer.innerHTML = '' 

    cart.products.forEach(product => {
        const productElement = document.createElement('div')
        productElement.innerHTML = `
         <div class="detailCart">
            <div class="imageContainer">
                <img src="${product.product.thumbnails}" width="80px" alt="">
            </div>
            <div>
                <ul>
                    <li class="product">
                        <div class="name">${product.product.brands}</div>
                        <div class="brands">${product.product.name}</div>
                        Quantity: <span class="quantity">${product.quantity}</span> <br>
                        Price: $<span class="price">${product.product.price}</span> <br>
                    </li>
                </ul>
            </div>
              <div>
               </div>
                            
        `
        cartContainer.appendChild(productElement)
    })

    const cartDetailButton = document.createElement('button')
    cartDetailButton.textContent = 'VER DETALLE DEL CARRITO'
    cartDetailButton.className = 'cart-detail-button'

    cartDetailButton.addEventListener('click', () => {
        window.location.href = '/cart'
    })

    cartContainer.appendChild(cartDetailButton)

    const totalPriceElement = document.querySelector('#totalPrice')
    const total = cart.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0)
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${total.toFixed(2)}`
    }
    
    const totalQuantityElement = document.querySelector('#totalQuantity')
    const totalQuantity = cart.products.reduce((acc, product) => acc + product.quantity, 0)
    if (totalQuantityElement) {
        totalQuantityElement.textContent = totalQuantity
        totalQuantityElement.style.visibility = totalQuantity === 0 ? "hidden" : "visible"
    }
    
    const navTotalQuantityElement = document.querySelector('#navTotalQuantity')
    if (navTotalQuantityElement) {
        navTotalQuantityElement.textContent = totalQuantity === 0 ? ' ' : totalQuantity
        navTotalQuantityElement.style.visibility = totalQuantity === 0 ? "hidden" : "visible"
    }
    
    
}
