// public/js/render.js
export function renderProductos(productos) {
    const contenedor = document.getElementById('contenedor-productos')
    contenedor.innerHTML = ''
  
    productos.forEach(producto => {
      const card = document.createElement('div')
      card.className = 'card'
      card.innerHTML = `
        <img src="/img/${producto.imagen}" alt="${producto.nombre}" />
        <h3>${producto.nombre}</h3>
        <p>${producto.desc}</p>
        <p>Precio: $${producto.precio}</p>
        <button class="btnAgregar" data-id="${producto.id}">Agregar al carrito</button>
      `
      contenedor.appendChild(card)
    })
  }
  