import { getSession } from "../../../utils/sessionstorage.controller.js";

const txtSaludo = document.getElementById('txtSaludo')

const user = getSession('user')

txtSaludo.textContent = `Hola ${user.name} ${user.lastname}`


fetch('/productos')
  .then(res => res.json())
  .then(data => renderProductos(data))
  .catch(err => console.error('Error al obtener productos:', err))


  function renderProductos(productos) {
    const contenedor = document.getElementById('contenedorProductos')
    contenedor.innerHTML = ''
  
    productos.forEach(prod => {
      const div = document.createElement('div')
      div.classList.add('producto')
  
      div.innerHTML = `
        <img src="/img/${prod.imagen}" alt="${prod.nombre}" width="200">
        <h3>${prod.nombre}</h3>
        <p>${prod.desc}</p>
        <p><strong>$${prod.precio.toLocaleString()}</strong></p>
        <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
      `
  
      contenedor.appendChild(div)
    })
  }
  
  function agregarAlCarrito(id) {
    console.log('Producto agregado al carrito. ID:', id)
  
    // Podés usar localStorage, sessionStorage o una petición POST más adelante
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []
    carrito.push(id)
    localStorage.setItem('carrito', JSON.stringify(carrito))
  }
