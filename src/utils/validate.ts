export const validateUsername = (username: string) => {
  const formatUsername = username.trim()

  return formatUsername.length >= 5 && formatUsername.length <= 20
}

export const validateEmail = (email: string) => {

    const formatEmail = email.trim().toLowerCase()

    const emailRegex =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
    return emailRegex.test(formatEmail)
  }

  export const validatePassword = (password: string) => {

    const formatPwd = password.trim()
  
    return formatPwd.length >= 6 && formatPwd.length <= 16
  }
