import { Widget, ContainerWidget } from "@cnuebred/frontforge"
import { page_center } from "src/view/templates/page"
import { login_by_discord_button, login_by_github_button } from "./auth.utils.view"

// @preserve HOTRELOAD_CLIENT

const register_text = new Widget('h1.font-mono.t_center', 'REGISTER')
const email_input = new Widget('input.font-mono.t_center')
const login_input = new Widget('input.font-mono.t_center')
const password_input = new Widget('input.font-mono.t_center')
const submit_button = new Widget('button.font-mono.t_center', 'create account')

const hr = new Widget('hr')
hr.style.width = '100%'

const hyperlink_login = new Widget('a.font-mono.t_center', 'have an account? sign in 😏')
hyperlink_login.attribute = {
  href: '/auth/login'
}


email_input.attribute = {
  placeholder: 'email'
}
login_input.attribute = {
  placeholder: 'login'
}
password_input.attribute = {
  placeholder: 'password',
  type: 'password'
}


page_center([
  register_text,
  email_input,
  login_input,
  password_input,
  submit_button,
  hr.clone(),
  login_by_github_button(),
  login_by_discord_button(),
  hr.clone(),
  hyperlink_login
]).hook('app')


document.querySelectorAll('filler').forEach(item => item.remove()) 