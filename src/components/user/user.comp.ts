import { auth, need, Pinpack, pins, PinupController } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/bundle'
import { BUNDLE } from '../../utils/bundle'
import path from "path";
import url from "url";
import { ERROR_CODE_QUERY, NOTIFY_QUERY } from "../../const";
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
  profile: 'view/user.profile.view.ts',
}


export class User extends PinupController {
  view: Record<keyof typeof view_files, ForgeBundle | null> = {
    profile: null,
  }
  async $init() {
    this.path = endpoint_struct.$path
    this.pin(UserApi)
    this.files(path.resolve('./src/view/assets'), 'view/assets')
    this.view.profile = await BUNDLE(__dirname, view_files.profile, 'user.scss')

    this.debug_show_statistic()
  }
  @pins.get()
  @auth({ should_end_with_error: false, data_source: 'query', data_name: 'token' })
  main_view({ req, res, options }: Pinpack) {
    if (options.auth.passed) {
      const hash = options.auth.payload['hash']
      const jwtoken = options.auth.sign({
        hash: hash
      }, null, {
        expiresIn: '1m'
      })

      res.status(200).redirect(
        url.format({
          pathname:`${endpoint_struct.$path}/${hash}`,
          query: {
            'token': `Bearer ${jwtoken}`
          },
        })
        
      )
    } else {
      res.status(200).redirect(`/home`)
    }
  }

  @pins.get(endpoint_struct.profile)
  @need.params([need_params.user_hash])
  @auth({ should_end_with_error: false, data_source: 'query' , data_name: 'token'})
  profile_view({ req, res, options }: Pinpack) {
    this.view.profile.replace({
      ERROR_CODE_QUERY: ERROR_CODE_QUERY,
      NOTIFY_QUERY: NOTIFY_QUERY,
      BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
    })
    return res.status(200).send(this.view.profile.html)
  }
}

