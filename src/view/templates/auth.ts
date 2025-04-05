import { TOKEN_QUERY } from "src/const"
import { basic_signal_colors_e, notify } from "./notify"

export const JWTOKEN_KEY_NAME = "jwtoken"


export const back_to_login = () => {
  if (window.location.pathname != '/auth/login') {
    notify('Your token is invalid; Forwarding to login page', basic_signal_colors_e.RED)
    setTimeout(() => {
      window.location.href = '/auth/login'
    }, 5000)
  }
}

export const refresh_token_or_back_to_login = async () => {
  const token_pack = get_current_auth_token_object()
  if (!token_pack) {
    back_to_login()
    return null
  }
  const response = await fetch(`BACKEND_ORIGIN/auth/api/v0/auth`, {
    method: 'GET',
    headers: {
      authorization: token_pack.token
    }
  })
  await update_oauth_and_get_data_by_response(response)
  return token_pack
}

export const get_current_auth_token_object = () => {
  const auth_token = localStorage.getItem(JWTOKEN_KEY_NAME)
  const auth_token_type = auth_token?.split(' ')[0]
  const auth_token_jwt = auth_token?.split(' ')[1]

  if (!auth_token_jwt || !auth_token_type || auth_token_type != 'Bearer') {
    return null
  }
  
  return {
    jwt: auth_token_jwt,
    type: auth_token_type,
    token: auth_token
  }
}

export const update_oauth_and_get_data_by_response = async (response: Response) => {
  if (response.status == 401){
    localStorage.setItem(JWTOKEN_KEY_NAME, null)
    return null
  }
  if (!response.ok) return null
    const response_json = await response.json()
    localStorage.setItem(JWTOKEN_KEY_NAME, response_json.data.jwtoken)
    return response_json.data
}