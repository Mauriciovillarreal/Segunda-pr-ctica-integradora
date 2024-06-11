document.addEventListener("DOMContentLoaded", function () {
    const priceElement = document.querySelector('.price')
    if (priceElement) {
        const price = parseFloat(priceElement.textContent.replace('$', ''))
        const total = price / 6
        const totalCuotas = document.querySelector('.totalCuotas')
        if (totalCuotas) {
            totalCuotas.textContent = `6 cuotas de $${total.toFixed(2)} sin interés`
        }
    }
})
