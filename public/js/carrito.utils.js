import { getSession } from '../../utils/sessionstorage.controller.js'


export function agregarAlCarrito(id) {
  const user = getSession()

  if (!user || !user.id) {
    alert("Debes iniciar sesión para agregar al carrito.")
    return
  }

  const clave = `carrito_${user.id}`
  const carrito = JSON.parse(localStorage.getItem(clave)) || []

  const item = carrito.find(p => p.id === id)

  if (!item) {
    carrito.push({ id, cantidad: 1 })
  } else {
    item.cantidad++
  }

  localStorage.setItem(clave, JSON.stringify(carrito))
  alert("Producto agregado al carrito.")
}


export function obtenerCarritoActual() {
  const user = getSession()
  if (!user || !user.id) return []
  const clave = `carrito_${user.id}`
  return JSON.parse(localStorage.getItem(clave)) || []
}


export function vaciarCarrito() {
  const user = getSession()
  if (!user || !user.id) return
  const clave = `carrito_${user.id}`
  localStorage.removeItem(clave)
}


// Función para finalizar compra
export async function finalizarCompra() {
  const user = getSession()
  if (!user || !user.id) {
    alert("Debes iniciar sesión para finalizar la compra.")
    return
  }

  const carrito = obtenerCarritoActual()

  if (carrito.length === 0) {
    alert("Tu carrito está vacío.")
    return
  }

  try {
    // Traemos todos los productos desde la API
    const res = await fetch('http://localhost:5000/productos')
    const productos = await res.json()

    const detallesVenta = []
    let sinStock = []

    // Validamos y preparamos los productos a descontar
    for (let item of carrito) {
      const producto = productos.find(p => (p._id || p.id) === item.id)

      if (!producto) {
        sinStock.push(`Producto no encontrado (ID: ${item.id})`)
        continue
      }

      if ((producto.stock ?? 0) < item.cantidad) {
        sinStock.push(`${producto.name || producto.nombre} (stock insuficiente)`)
        continue
      }

      detallesVenta.push({
        id: item.id,
        cantidad: item.cantidad,
        precio: producto.price || producto.precio
      })
    }

    if (sinStock.length > 0) {
      alert("No se pudo finalizar la compra:\n" + sinStock.join("\n"))
      return
    }

    // Descontar stock en el backend
    const updateStockRes = await fetch('http://localhost:5000/ventas/finalizar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        items: detallesVenta
      })
    })

    if (!updateStockRes.ok) throw new Error("Error al procesar la venta.")

    vaciarCarrito()
    alert("Compra realizada con éxito.")
    // location.reload()
    actualizarVistaProductos()

  } catch (err) {
    console.error(err)
    alert("Ocurrió un error al finalizar la compra.")
  }
}

export async function actualizarVistaProductos() {
  try {
    const res = await fetch('http://localhost:5000/productos')
    const productosActualizados = await res.json()

    productosActualizados.forEach(producto => {
      const boton = document.querySelector(`#btnAgregar_${producto._id || producto.id}`)
      if (boton) {
        if (producto.stock <= 0) {
          boton.disabled = true
          boton.textContent = "Sin stock"
          boton.classList.remove("bg-green-600", "hover:bg-green-700")
          boton.classList.add("bg-gray-500", "cursor-not-allowed")
        } else {
          boton.disabled = false
          boton.textContent = "Agregar al carrito"
          boton.classList.remove("bg-gray-500", "cursor-not-allowed")
          boton.classList.add("bg-green-600", "hover:bg-green-700")
        }
      }
    })
  } catch (error) {
    console.error("Error al actualizar productos:", error)
  }
}



  