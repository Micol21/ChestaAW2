import { agregarAlCarrito } from './carrito.utils.js'
import { actualizarVistaProductos } from './carrito.utils.js'

const selectCategoria = document.getElementById('categoria')
const contenedor = document.getElementById('resultado')

selectCategoria.addEventListener('change', async () => {
  const categoria = selectCategoria.value.trim()
  contenedor.innerHTML = ""

  if (!categoria) return

  try {
    const res = await fetch('http://localhost:5000/productos')
    const productos = await res.json()

    const filtrados = productos.filter(p =>
      (p.categoria || '').toLowerCase() === categoria.toLowerCase()
    )

    if (filtrados.length === 0) {
      contenedor.innerHTML = `<p class="text-gray-400">No hay productos en esta categoría.</p>`
      return
    }

    filtrados.forEach(p => {
      const id = p._id || p.id
      const nombre = p.name || p.nombre
      const descripcion = p.desc || 'Sin descripción'
      const precio = p.price || p.precio
      const stock = p.stock ?? 0

      const card = document.createElement('div')
      card.className = "bg-gray-800 p-4 rounded shadow text-white"

      card.innerHTML = `
        <h2 class="text-xl font-bold mb-2">${nombre}</h2>
        <p class="text-sm text-gray-300">${descripcion}</p>
        <p class="text-sm text-gray-400 mt-1">Precio: $${precio}</p>
        <p class="text-sm text-blue-300 mt-1">Categoría: ${p.categoria}</p>
        <p class="text-sm text-yellow-400 mt-1">Stock: ${stock}</p>
        <button 
          id="btnAgregar_${id}" 
          class="btnAgregar mt-4 px-4 py-2 rounded text-white font-medium ${stock === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}"
          data-id="${id}" 
          ${stock === 0 ? 'disabled' : ''}
        >
          ${stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      `

      contenedor.appendChild(card)
    })

    
    actualizarVistaProductos()

  } catch (err) {
    console.error(err)
    contenedor.innerHTML = `<p class="text-red-500">Error al cargar los productos.</p>`
  }
})


document.addEventListener('click', e => {
  if (e.target.classList.contains('btnAgregar')) {
    const id = e.target.dataset.id
    if (id) agregarAlCarrito(id)
  }
})
