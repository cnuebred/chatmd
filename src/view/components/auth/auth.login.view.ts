import { Widget } from "@cnuebred/frontforge"
import { page_center, page_cleaner } from "src/view/templates/page"
import { login_by_discord_button, login_by_github_button } from "./auth.utils.view"
import { refresh_token_or_back_to_login } from "src/view/templates/auth"
import { execute_global_url_query_actions } from "src/view/templates/url_setup"
import { USER_API_ENDPOINT_STRUCT, USER_ENDPOINT_STRUCT } from "src/const"

// @preserve HOTRELOAD_CLIENT

const async_queue = async () => {
  execute_global_url_query_actions()
  const token_pack = await refresh_token_or_back_to_login()
  if (token_pack){
    window.location.href = `/${USER_ENDPOINT_STRUCT.$path}`
  }
}

async_queue()

const login_text = new Widget('h1.font-mono.t_center', 'LOGIN')
const login_input = new Widget('input.font-mono.t_center')
const password_input = new Widget('input.font-mono.t_center')
const submit_button = new Widget('button.font-mono.t_center', 'sign in')

const hr = new Widget('hr')
hr.style.width = '100%'

const hyperlink_register = new Widget('a.font-mono.t_center', 'no account? register :3')
hyperlink_register.attribute = {
  href: '/auth/register'
}

login_input.attribute = {
  placeholder: 'login'
}
password_input.attribute = {
  placeholder: 'password',
  type: 'password'
}

page_center([
  login_text,
  login_input,
  password_input,
  submit_button,
  hr.clone(),
  login_by_github_button(),
  login_by_discord_button(),
  hr.clone(),
  hyperlink_register,
]).hook('app')


page_cleaner()
