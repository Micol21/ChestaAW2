import { obtenerCarritoActual } from './carrito.utils.js'
import { getSession } from '../../utils/sessionstorage.controller.js'


const carrito = obtenerCarritoActual()

const cartContainer = document.getElementById('cartItems')
const cartTotal = document.getElementById('cartTotal')
const btnCheckout = document.getElementById('checkoutBtn')

async function cargarCarrito() {
  try {
    const res = await fetch('http://localhost:5000/productos/')
    const productos = await res.json()

    if (carrito.length === 0) {
      cartContainer.innerHTML = `<p class="text-gray-400">No hay productos en el carrito.</p>`
      cartTotal.textContent = "$0"
      return
    }

    cartContainer.innerHTML = ''
    let total = 0

    carrito.forEach(item => {
      const producto = productos.find(p => p._id === item.id)
      if (producto) {
        const subtotal = parseFloat(producto.price) * item.cantidad
        total += subtotal

        const div = document.createElement('div')
        div.className = "bg-gray-700 p-4 rounded flex justify-between items-center"
        div.innerHTML = `
          <div>
            <h3 class="font-bold">${producto.name}</h3>
            <p class="text-sm text-gray-300">${producto.desc}</p>
            <p class="text-sm text-gray-400">Cantidad: ${item.cantidad}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold">$${subtotal}</p>
          </div>
        `
        cartContainer.appendChild(div)
      }
    })

    cartTotal.textContent = `$${total}`
  } catch (error) {
    console.error("Error al cargar carrito:", error)
    cartContainer.innerHTML = `<p class="text-red-400">Error al cargar los productos del carrito.</p>`
  }
}

btnCheckout.addEventListener('click', async () => {
  
  const token = sessionStorage.getItem('token')
  const user = getSession()
  const clave = `carrito_${user?.id}`
  const carrito = JSON.parse(localStorage.getItem(clave)) || []

  if (!token || !user?.id) return alert("Debes iniciar sesión para comprar.")
  if (carrito.length === 0) return alert("Tu carrito está vacío.")

 
  const productosResponse = await fetch('http://localhost:5000/productos/')
  const productos = await productosResponse.json()

  let total = 0
  carrito.forEach(item => {
    const prod = productos.find(p => p._id === item.id)
    if (prod) total += prod.price * item.cantidad
  })

  const ventaData = {
    id_usuario: user.id,
    total,
    direccion: "Dirección de prueba", 
    productos: carrito.map(p => ({ id: p.id, cantidad: p.cantidad }))
  }

  try {
    const res = await fetch('http://localhost:5000/ventas/create', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(ventaData)
    })

    const data = await res.json()

    if (res.ok) {
      alert("¡Compra realizada con éxito!")
      localStorage.removeItem(clave)
      window.location.reload()
    } else {
      alert(data.mensaje || "Error al finalizar la compra.")
    }

  } catch (err) {
    console.error(err)
    alert("Error al finalizar la compra")
  }
})

cargarCarrito()
