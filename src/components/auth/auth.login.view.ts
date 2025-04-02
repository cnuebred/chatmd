import { Widget } from "@cnuebred/frontforge"
import { empty_filler } from "src/utils/view"
import { page_center } from "src/view/templates/page"
import { login_by_discord_button, login_by_github_button } from "./auth.utils.view"
import { URL_NOTIFY_ACTIONS_NAMETAGS } from "src/const"
import { basic_signal_colors_e, is_notify_eq_action, send_url_notify } from "../../view/templates/notify"

// @preserve HOTRELOAD_CLIENT

const url_query_actions = () => {
  const url = new URL(document.location.href)
  if (url.searchParams.get('token')) {
    localStorage.setItem('token', url.searchParams.get('token'))
  } else if (url.searchParams.get('NOTIFY_QUERY')) {
    if (is_notify_eq_action(
      url, URL_NOTIFY_ACTIONS_NAMETAGS.successful_create_account
    )) {
      send_url_notify(
        url,
        'Successful created account - re-login on this site',
        basic_signal_colors_e.GREEN
      )
    }
    if (is_notify_eq_action(url, URL_NOTIFY_ACTIONS_NAMETAGS.fail)) {

      send_url_notify(url, 'Cannot create account', basic_signal_colors_e.RED)
    }
  }
}

url_query_actions()

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


document.querySelectorAll('filler').forEach(item => item.remove()) 
