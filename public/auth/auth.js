const btnLogin = document.getElementById('btnLogin')
const mensajeLogin = document.getElementById('mensajeLogin')

import { addSession } from "../../utils/sessionstorage.controller.js"

// Función para autenticar al usuario
const auth = async ({ name, pass }) => {
  try {
    const response = await fetch('http://localhost:5000/users/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: name, pass }) 
    })

    const data = await response.json()

    if (!response.ok || !data.status) {
      throw new Error(data.mensaje || "Error al iniciar sesión")
    }

    return data 
  } catch (error) {
    console.error("Error en auth:", error)
    throw error
  }
}

// Evento cuando se hace click en "Ingresar"
btnLogin.addEventListener('click', async () => {
  const name = document.getElementById('txtName').value.trim()
  const pass = document.getElementById('txtPass').value.trim()

  mensajeLogin.textContent = '' 
  mensajeLogin.className = ''   

  if (name && pass) {
    try {
      const data = await auth({ name, pass }) 
      addSession(data.token,data.user) 

      mensajeLogin.textContent = "Inicio de sesión correcto"
      mensajeLogin.classList.add("text-green-400")

      setTimeout(() => {
        window.location.href = "./home.html"
      }, 1000)

    } catch (error) {
      mensajeLogin.textContent = error.message
      mensajeLogin.classList.add("text-red-400")
    }
  } else {
    mensajeLogin.textContent = "Por favor completá todos los campos."
    mensajeLogin.classList.add("text-red-400")
  }
})

    



