// public/js/carrito.js
const carrito = JSON.parse(localStorage.getItem('carrito')) || []

document.addEventListener('click', e => {
  if (e.target.classList.contains('btnAgregar')) {
    const id = e.target.dataset.id
    agregarAlCarrito(id)
  }
})

function agregarAlCarrito(id) {
  const item = carrito.find(p => p.id === id)
  if (!item) {
    carrito.push({ id, cantidad: 1 })
  } else {
    item.cantidad++
  }

  localStorage.setItem('carrito', JSON.stringify(carrito))
  alert('Producto agregado al carrito')
}
