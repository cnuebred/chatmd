
import { Flex, flex_justify_e, flex_wrap_e, Grid, grid_justify_content_e, Pocket, Widget } from "@cnuebred/frontforge"
import { empty_filler } from "src/utils/view"
import { page_cleaner } from "src/view/templates/page"
import {
  back_to_login,
  get_current_auth_token_object,
  refresh_token_or_back_to_login,
  update_oauth_and_get_data_by_response
} from "src/view/templates/auth"
import { execute_global_url_query_actions } from "src/view/templates/url_setup"

// @preserve HOTRELOAD_CLIENT

execute_global_url_query_actions()
refresh_token_or_back_to_login()


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
  x.clone(), x.clone(), x.clone(), x.clone(),
  x.clone(), x.clone(), x.clone(), x.clone(),
  x.clone(), x.clone(), x.clone(), x.clone()
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


const get_user_data = async () => {
  const token_pack = get_current_auth_token_object()
  if (!token_pack) {
    return back_to_login()
  }
  const response = await fetch(`BACKEND_ORIGIN/user/api/v0/me`, {
    method: 'GET',
    headers: {
      authorization: token_pack.token
    }
  })
  const data = await update_oauth_and_get_data_by_response(response)
  pocket.target.me_data = data.user

  pocket.target.hello_span = pocket.target.me_data.username
  login_text.class.remove('lazy_loading')
  login_text.render()
}

// ubrać to w strukturę funkcyjną - gotowa do autoryzacji - pobierania danych oraz wykonywania funkcji po stronie backendu
// resolvery związane z bazą danych
// workery związane z przetwarzaniem po stronie serwera

// dodać obsługe błędów - te z response - jeśli błąd to info o tym gdzie wystąpił itp


// zmienić system notify - jest do dupy



get_user_data()

page_cleaner()

