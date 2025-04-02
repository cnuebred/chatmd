
import { ContainerWidget, Flex, flex_align_content_e, flex_justify_e, flex_wrap_e, Grid, grid_align_content_e, grid_justify_content_e, Pocket, Widget } from "@cnuebred/frontforge"
import { empty_filler } from "src/utils/view"
import { page_center } from "src/view/templates/page"
import { URL_NOTIFY_ACTIONS_NAMETAGS } from "src/const"
import { basic_signal_colors_e, is_notify_eq_action, notify, send_url_notify } from "../../../view/templates/notify"
import { update_oauth_jwt } from "src/view/templates/auth"

// @preserve HOTRELOAD_CLIENT

const pocket = new Pocket({
  hello_span: '...',
  me_data: {
    username: ''
  }
})

const login_text = new Widget('h1.font-mono.t_center.lazy_loading', () => `Hi, ${pocket.target.hello_span}!`)

const create_new_doc = new Widget('button.font-mono.t_center', 'Create New Doc')

const x = new Widget('div.font-mono.docblock', '')

const list_of_all_user_docs = Flex([
  x.clone(), x.clone(), x.clone(), x.clone(), 
  x.clone(), x.clone(), x.clone(),x.clone(),
  x.clone(), x.clone(), x.clone(),x.clone(),
  x.clone(), x.clone(), x.clone(),x.clone()
], {
  justify_content: flex_justify_e.space_around,
  wrap: flex_wrap_e.wrap,
  column_gap: '15px',
  row_gap: '15px'
})

const grid = Grid([
  [empty_filler(), empty_filler(), login_text, empty_filler(), empty_filler()],
  [empty_filler(), empty_filler(), create_new_doc, empty_filler(), empty_filler()],
  [empty_filler(), {
    widget: list_of_all_user_docs,
    col_span: 5,
    row_span: 3
  }, empty_filler()]
], {
  justify_content: grid_justify_content_e.space_between,
  gridTemplateColumns: '20px auto auto auto 20px',
  column_gap: '10px',
  row_gap: '10px'
}).hook('app')

const url_query_actions = () => {
  const url = new URL(document.location.href)
  if (url.searchParams.get('token')) {
    update_oauth_jwt(url.searchParams.get('token'))
    url.searchParams.delete('token')
    window.history.pushState('-', '-', url.href);
  }
}

const get_user_data = async () => {
  const auth_token = localStorage.getItem('token')?.split(' ')
  if(!auth_token){
    notify('Your token is invalid', basic_signal_colors_e.RED)
  }

  const token_type = auth_token[0]
  if (token_type == 'Bearer'){
    const jwtoken = auth_token[1]
    const response = await fetch(`BACKEND_ORIGIN/u/api/v0/me`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${jwtoken}`
      }
    })
    if (!response.ok) return
    const data = await response.json()
    console.log(data)
    update_oauth_jwt(data.data.jwt)  
    pocket.target.me_data = data.data.user
  }else{
    notify('Your token is invalid: "wrong type"', basic_signal_colors_e.RED)
  }

  pocket.target.hello_span = pocket.target.me_data.username
  login_text.class.remove('lazy_loading')
  login_text.render()
}

// ubrać to w strukturę funkcyjną - gotowa do autoryzacji - pobierania danych oraz wykonywania funkcji po stronie backendu
// resolvery związane z bazą danych
// workery związane z przetwarzaniem po stronie serwera

url_query_actions()
get_user_data()

document.querySelectorAll('filler').forEach(item => item.remove()) 
