import { auth, need, Pinpack, pins, PinupController, reply } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/bundle'
import { BUNDLE } from '../../utils/bundle'
import path from "path";
import { ERROR_CODE_QUERY, NOTIFY_QUERY } from "../../const";
import { API_URL } from "../../utils/resolver";
import { get_account_data as get_account_data_by_hash } from "./user.resolver";



const need_params = {
  user_hash: 'user_hash'
}

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
        jwt: `Bearer ${jwtoken}`,
        user: me_data
      }
    })
    )
  }
}

