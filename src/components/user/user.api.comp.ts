import { auth, need, Pinpack, pins, PinupController, reply } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/bundle'
import { BUNDLE } from '../../utils/bundle'
import path from "path";
import { BEARER_TOKEN, ERROR_CODE_QUERY, NOTIFY_QUERY, TOKEN_QUERY, URL_NOTIFY_ACTIONS_NAMETAGS } from "../../const";
import { API_URL } from "../../utils/resolver";
import { get_account_data as get_account_data_by_hash } from "./user.resolver";
import url from "url";


export const endpoint_struct = {
  $path: 'u',
  me: `me`,
}

export class UserApi extends PinupController {
  async $init() {
    this.path = API_URL('')
    this.files(path.resolve('./src/view/assets'), 'view/assets')

    this.debug_show_statistic()
  }
  @pins.get(endpoint_struct.$path)
  @auth({ should_end_with_error: false})
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
          pathname: `/${endpoint_struct.$path}/${hash}`,
          query: {
            [TOKEN_QUERY]: BEARER_TOKEN(jwtoken)
          },
        })

      )
    } else {
      res.status(200).redirect(`/auth/login`)
    }
  }


  @pins.get(endpoint_struct.me)
  @auth({ should_end_with_error: true })
  async me({ req, res, options }: Pinpack) {
    const hash = options.auth.payload['hash']
    const jwtoken = options.auth.sign({
      hash: hash
    })

    const me_data = await get_account_data_by_hash(hash)
    return res.status(200).send(reply({
      msg: '@me data by jwt',
      data: {
        [TOKEN_QUERY]: BEARER_TOKEN(jwtoken),
        user: me_data
      }
    })
    )
  }
}

