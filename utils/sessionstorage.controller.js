
  
export const getSession = () => {
    return JSON.parse(sessionStorage.getItem('user'))
  }
  
  export const addSession = (token, user) => {
    sessionStorage.setItem("token", token)
    sessionStorage.setItem("user", JSON.stringify(user))
  }
  
  export const clearSession = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
  }
  
  