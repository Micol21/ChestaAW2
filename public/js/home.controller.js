import { agregarAlCarrito } from './carrito.utils.js'

const contenedor = document.getElementById('productosContainer')

async function obtenerProductos() {
  try {
    const res = await fetch('http://localhost:5000/productos/')
    const productos = await res.json()
    renderizarProductos(productos)
  } catch (err) {
    contenedor.innerHTML = "<p class='text-red-400'>Error al cargar productos</p>"
    console.error("Error al traer productos:", err)
  }
}

function renderizarProductos(productos) {
  contenedor.innerHTML = ''

  productos.forEach(p => {
    const id = p._id || p.id
    const nombre = p.name || p.nombre || 'Producto'
    const precio = p.price || p.precio || 0
    const descripcion = p.desc || 'Sin descripción'

    const div = document.createElement('div')
    div.className = "bg-gray-800 p-4 rounded shadow flex flex-col justify-between"

    div.innerHTML = `
      <h3 class="text-lg font-bold">${nombre}</h3>
      <p>${descripcion}</p>
      <p class="mt-2 font-semibold">$${precio}</p>
      <button class="btnAgregar mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" data-id="${id}">
        Agregar al carrito
      </button>
    `
    contenedor.appendChild(div)
  })
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('btnAgregar')) {
    const id = e.target.dataset.id
    if (id) agregarAlCarrito(id)
  }
})

obtenerProductos()
