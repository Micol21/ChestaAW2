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


  