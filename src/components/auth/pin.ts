import { auth, need, Pinpack, pins, PinupController, reply } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/bundle'
import { BUNDLE, COMPONENT_VIEW_PATH, STYLE_VIEW_PATH } from '../../utils/bundle'
import { AuthApi } from "./api.pin";
import path from "path";
import {
  AUTH_ENDPOINT_STRUCT,
  DISCORD_AUTH_CLIENT_ID,
  DISCORD_OAUTH_AUTHORIZE_URL,
  GITHUB_AUTH_CLIENT_ID,
  GITHUB_OAUTH_AUTHORIZE_URL,
} from "../../const";


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
    this.path = AUTH_ENDPOINT_STRUCT.$path
    this.pin(AuthApi)
    this.files(path.resolve('./src/view/assets'), 'view/assets')
    this.view.login = await BUNDLE(
      COMPONENT_VIEW_PATH(this.path, view_files.login),
      STYLE_VIEW_PATH('auth.scss')
    )
    this.view.register = await BUNDLE(
      COMPONENT_VIEW_PATH(this.path, view_files.register),
      STYLE_VIEW_PATH('auth.scss')
    )
    this.view.min10 = await BUNDLE(
      COMPONENT_VIEW_PATH(this.path, view_files.min10),
      STYLE_VIEW_PATH('auth.scss')
    )

    this.debug_show_statistic()
  }
  @pins.get(AUTH_ENDPOINT_STRUCT.login)
  login_view({ res }: Pinpack) {
    this.view.login.replace({
      [GITHUB_AUTH_CLIENT_ID]: process.env.GITHUB_AUTH_CLIENT_ID,
      GITHUB_OAUTH_AUTHORIZE_URL: GITHUB_OAUTH_AUTHORIZE_URL,
      [DISCORD_AUTH_CLIENT_ID]: process.env.DISCORD_AUTH_CLIENT_ID,
      DISCORD_OAUTH_AUTHORIZE_URL: DISCORD_OAUTH_AUTHORIZE_URL,
      DISCORD_OAUTH_REDIRECT_URL: process.env.DISCORD_OAUTH_REDIRECT_URL,
    })
    return res.status(200).send(this.view.login.html)
  }
  @pins.get(AUTH_ENDPOINT_STRUCT.register)
  register_view({ res }: Pinpack) {
    this.view.register.replace({
      [GITHUB_AUTH_CLIENT_ID]: process.env.GITHUB_AUTH_CLIENT_ID,
      GITHUB_OAUTH_AUTHORIZE_URL: GITHUB_OAUTH_AUTHORIZE_URL
    })
    return res.status(200).send(this.view.register.html)
  }
  @pins.get(AUTH_ENDPOINT_STRUCT.min10)
  min10_view({ res }: Pinpack) {
    return res.status(200).send(this.view.min10.html)
  }
}

