const btnLogin = document.getElementById('btnLogin')
import { addSession } from "../../utils/sessionstorage.controller.js";
// input = lo que ingresa el usuario por txt
//output = la info de los json en base al usuario ingresado
const auth = async({name,pass})=>{
    const user = await fetch('http://localhost:5000/users/login',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({"userName": name, "pass":pass})
    }).then((res=>{
        if(!res.ok){
            throw new Error('Error en la peticion')
        }
        return res.json()
    })).catch(error =>{
        console.log('Error',error)
    });
    
    console.log(user)
}
btnLogin.addEventListener('click',async()=>{
    const name = document.getElementById('txtName').value
    const pass = document.getElementById('txtPass').value

    if (name != ''&& pass != '') {
        //se hace la busqueda
        try {
            const user = await auth({name,pass})
            addSession(user)
            //Window.location.href = ../pages/home"
        } catch (error) {
            alert('No se encontro usuario')
        }
        
    } else {
        alert('Campos faltantes')
    }
})