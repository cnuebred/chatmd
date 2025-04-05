import { auth, need, Pinpack, pins, PinupController } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/bundle'
import { BUNDLE } from '../../utils/bundle'
import path from "path";
import url from "url";
import { BEARER_TOKEN, ERROR_CODE_QUERY, NOTIFY_QUERY, TOKEN_QUERY, URL_NOTIFY_ACTIONS_NAMETAGS } from "../../const";
import { UserApi } from "./user.api.comp";
import { AuthType } from "pinup/dist/d";
import { encrypt } from "../../utils/crypto";



const need_params = {
  user_hash: 'user_hash'
}

export const endpoint_struct = {
  $path: 'u',
  profile: `:${need_params.user_hash}`,
}

const view_files = {
  user: 'view/user.view.ts',
  profile: 'view/user.profile.view.ts',
}


export class User extends PinupController {
  view: Record<keyof typeof view_files, ForgeBundle | null> = {
    user: null,
    profile: null,
  }
  async $init() {
    this.path = endpoint_struct.$path
    this.pin(UserApi)
    this.files(path.resolve('./src/view/assets'), 'view/assets')
    this.view.profile = await BUNDLE(__dirname, view_files.profile, 'user.scss')
    this.view.user = await BUNDLE(__dirname, view_files.user, 'user.scss')

    this.debug_show_statistic()
  }
  @pins.get('')
  main_view({ req, res, options }: Pinpack) {
    this.view.user.replace({
      ERROR_CODE_QUERY: ERROR_CODE_QUERY,
      NOTIFY_QUERY: NOTIFY_QUERY,
      BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
    })
    return res.status(200).send(this.view.user.html)
  }

  @pins.get(endpoint_struct.profile)
  @need.params([need_params.user_hash])
  @auth({ should_end_with_error: false, data_source: 'query' , data_name: TOKEN_QUERY})
  profile_view({ req, res, options }: Pinpack) {
    this.view.profile.replace({
      ERROR_CODE_QUERY: ERROR_CODE_QUERY,
      NOTIFY_QUERY: NOTIFY_QUERY,
      BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
    })
    return res.status(200).send(this.view.profile.html)
  }
}

