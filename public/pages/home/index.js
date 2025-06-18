import { getSession } from "../../../utils/sessionstorage.controller.js";
import { renderProductos } from '/js/render.js'

const txtSaludo = document.getElementById('txtSaludo')

const user = getSession('user')

txtSaludo.textContent = `Hola ${user.name} ${user.lastname}`


fetch('/productos')
  .then(res => res.json())
  .then(data => renderProductos(data))
  .catch(err => console.error('Error al obtener productos:', err))


  
