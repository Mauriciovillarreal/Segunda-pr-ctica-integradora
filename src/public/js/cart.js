document.addEventListener("DOMContentLoaded", function () {
    if (document.readyState === "interactive" || document.readyState === "complete") {
        const carts = document.querySelectorAll('.cart')
        carts.forEach(cart => {
            let totalPrice = 0
            let totalQuantity = 0
            const products = cart.querySelectorAll('.product')

            products.forEach(product => {
                const priceElement = product.querySelector('.price')
                const quantityElement = product.querySelector('.quantity')

                if (priceElement && quantityElement) {
                    const price = parseFloat(priceElement.textContent)
                    let quantity = parseInt(quantityElement.textContent)
                    if (quantity === 0) {
                        quantity = " "
                    }
                    totalPrice += price * quantity
                    totalQuantity += quantity
                }
            })

            const totalElement = cart.querySelector('#totalPrice')
            if (totalElement) {
                totalElement.textContent = `$${totalPrice.toFixed(2)}`
            }

            const totalQuantityElement = document.querySelector('#totalQuantity')
            if (totalQuantityElement) {
                totalQuantityElement.textContent = totalQuantity !== 0 ? totalQuantity : " "
            }

            const navTotalQuantityElement = document.querySelector('#navTotalQuantity')
            if (navTotalQuantityElement) {
                navTotalQuantityElement.textContent = totalQuantity !== 0 ? totalQuantity : " "
            }

        })
    }
})

async function deleteCart() {
    const cartId = document.getElementById("cartId").value
    try {
        const response = await fetch(`/api/carts/${cartId}`, {
            method: 'DELETE'
        })
        if (response.ok) {
            const data = await response.json()
            console.log(data.message)
            const cartProducts = document.querySelector('.detailCart')
            if (cartProducts) {
                cartProducts.innerHTML = ''
            }
            const cartButton = document.querySelector('.cartButton')
            if (cartButton) {
                cartButton.innerHTML = '' 
            }
            const cartEmpty = document.querySelector('.cartEmpty')
            if (cartEmpty) {
                cartEmpty.innerHTML = 'Tu carrito está vacío'; 
            }
        } else {
            throw new Error('Failed to delete cart')
        }
    } catch (error) {
        console.error('An error occurred while deleting the cart:', error)
    }
}