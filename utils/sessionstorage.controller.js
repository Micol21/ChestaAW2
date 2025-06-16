export const addSession = (user)=>{
    sessionStorage.getItem('user',JSON.stringify(user))//PUEDE GUARDAR UN OBJETO EN FORMATO DE TEXTO
}

export const getSession = ()=> {//obtener la informacion de la sesion del navegador 
    return JSON.parse(sessionStorage.getItem('user'))
}