document.getElementById('btnRegistrar').addEventListener('click', async () => {
    const name = document.getElementById('txtNombre').value.trim()
    const lastname = document.getElementById('txtApellido').value.trim()
    const username = document.getElementById('txtUsername').value.trim()
    const pass = document.getElementById('txtPass').value.trim()
    const mensaje = document.getElementById('mensaje')
  
    if (!name || !lastname || !username || !pass) {
      mensaje.textContent = "Todos los campos son obligatorios."
      mensaje.classList.add("text-red-400")
      return
    }
  
    try {
      const response = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastname, username, pass })
      })
  
      const data = await response.json()
      console.log("Respuesta del servidor:", data, response.status)

      if (response.ok) {
        mensaje.textContent = "Usuario registrado correctamente"
        mensaje.classList.remove("text-red-400")
        mensaje.classList.add("text-green-400")
  
        setTimeout(() => {
          alert("Redirigiendo...")
          window.location.href = "pages/home/index.html"  
        }, 1500)
  
      } else {
        mensaje.textContent = `${data.mensaje || "Error al registrar"}`
        mensaje.classList.add("text-red-400")
      }
    } catch (error) {
      console.error("Error en el registro:", error)
      mensaje.textContent = "Error en la conexión con el servidor"
      mensaje.classList.add("text-red-400")
    }
  })
  