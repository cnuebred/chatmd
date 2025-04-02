import { auth, need, Pinpack, pins, PinupController, reply } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/bundle'
import { BUNDLE } from '../../utils/bundle'
import { AuthApi } from "./auth.api.comp";
import path from "path";
import { 
  DISCORD_AUTH_CLIENT_ID,
  DISCORD_OAUTH_AUTHORIZE_URL, 
  ERROR_CODE_QUERY, 
  GITHUB_AUTH_CLIENT_ID, 
  GITHUB_OAUTH_AUTHORIZE_URL, 
  NOTIFY_QUERY } from "../../const";

export const endpoint_struct = {
  $path: 'auth',
  login: 'login',
  register: 'register',
  min10: '10min',
}

const view_files = {
  login: 'auth.login.view.ts',
  register: 'auth.register.view.ts',
  min10: 'auth.min10.view.ts',
}

export class Auth extends PinupController {
  view: Record<keyof typeof view_files, ForgeBundle | null> = {
    login: null,
    register: null,
    min10: null,
  }
  async $init() {
    this.path = endpoint_struct.$path
    this.pin(AuthApi)
    this.files(path.resolve('./src/view/assets'), 'view/assets')
    this.view.login = await BUNDLE(__dirname, view_files.login, 'auth.scss')
    this.view.register = await BUNDLE(__dirname, view_files.register, 'auth.scss')
    this.view.min10 = await BUNDLE(__dirname, view_files.min10, 'auth.scss')

    this.debug_show_statistic()
  }
  @pins.get(endpoint_struct.login)
  login_view({ req, res, options }: Pinpack) {
    this.view.login.replace({
      [GITHUB_AUTH_CLIENT_ID]: process.env.GITHUB_AUTH_CLIENT_ID,
      GITHUB_OAUTH_AUTHORIZE_URL: GITHUB_OAUTH_AUTHORIZE_URL,
      [DISCORD_AUTH_CLIENT_ID]: process.env.DISCORD_AUTH_CLIENT_ID,
      DISCORD_OAUTH_AUTHORIZE_URL: DISCORD_OAUTH_AUTHORIZE_URL,
      DISCORD_OAUTH_REDIRECT_URL: process.env.DISCORD_OAUTH_REDIRECT_URL,
      ERROR_CODE_QUERY: ERROR_CODE_QUERY,
      NOTIFY_QUERY: NOTIFY_QUERY,
      BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
    })
    return res.status(200).send(this.view.login.html)
  }
  @pins.get(endpoint_struct.register)
  register_view({ req, res, options }: Pinpack) {
    this.view.register.replace({
      [GITHUB_AUTH_CLIENT_ID]: process.env.GITHUB_AUTH_CLIENT_ID,
      GITHUB_OAUTH_AUTHORIZE_URL: GITHUB_OAUTH_AUTHORIZE_URL
    })
    return res.status(200).send(this.view.register.html)
  }
  @pins.get(endpoint_struct.min10)
  min10_view({ req, res, options }: Pinpack) {
    return res.status(200).send(this.view.min10.html)
  }
}

