// @preserve HOTRELOAD_CLIENT

import { refresh_token_or_back_to_login } from "src/view/templates/auth"
import { execute_global_url_query_actions } from "src/view/templates/url_setup"


const scripts  = async () => {
  execute_global_url_query_actions()
  const token_pack = await refresh_token_or_back_to_login()
  if (token_pack){
    const response = await fetch(`BACKEND_ORIGIN/u/api/v0/u`, {
      method: 'GET',
      headers: {
        authorization: token_pack.token
      }
    })
    if (response.ok){
      window.location.href = response.url
    }else {
      window.location.href = '/login/auth'
    }
  }
}

scripts()