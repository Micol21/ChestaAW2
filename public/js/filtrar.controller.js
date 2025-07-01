
import { agregarAlCarrito } from './carrito.utils.js'

const selectCategoria = document.getElementById('categoria')
const contenedor = document.getElementById('resultado')

selectCategoria.addEventListener('change', async () => {
  const categoria = selectCategoria.value.trim()
  contenedor.innerHTML = ""

  if (!categoria) return

  try {
    const res = await fetch('http://localhost:5000/productos') // usa productos.json
    const productos = await res.json()

    // filtra localmente por categoría (insensible a mayúsculas)
    const filtrados = productos.filter(p =>
      (p.categoria || '').toLowerCase() === categoria.toLowerCase()
    )

    if (filtrados.length === 0) {
      contenedor.innerHTML = `<p class="text-gray-400">No hay productos en esta categoría.</p>`
      return
    }

    filtrados.forEach(p => {
      const card = document.createElement('div')
      card.className = "bg-gray-800 p-4 rounded shadow text-white"
      card.innerHTML = `
        <h2 class="text-xl font-bold mb-2">${p.name || p.nombre}</h2>
        <p class="text-sm text-gray-300">${p.desc}</p>
        <p class="text-sm text-gray-400 mt-1">Precio: $${p.price || p.precio}</p>
        <p class="text-sm text-blue-300 mt-1">Categoría: ${p.categoria}</p>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 btnAgregar" data-id="${p._id || p.id}">
          Agregar al carrito
        </button>
      `
      contenedor.appendChild(card)
    })
  } catch (err) {
    console.error(err)
    contenedor.innerHTML = `<p class="text-red-500">Error al cargar los productos.</p>`
  }
})

// Manejador para agregar al carrito
document.addEventListener('click', e => {
  if (e.target.classList.contains('btnAgregar')) {
    const id = e.target.dataset.id
    if (id) agregarAlCarrito(id)
  }
})
