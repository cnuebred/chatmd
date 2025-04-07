import { auth,  Pinpack, pins, PinupController, reply } from "pinup";
import path from "path";
import { BEARER_TOKEN,TOKEN_QUERY, USER_API_ENDPOINT_STRUCT, USER_ENDPOINT_STRUCT} from "../../const";
import { API_URL } from "../../utils/endpointer";
import { get_account_data as get_account_data_by_hash } from "./resolver";
import url from "url";




export class UserApi extends PinupController {
  async $init() {
    this.path = USER_API_ENDPOINT_STRUCT.$path
    this.files(path.resolve('./src/view/assets'), 'view/assets')

    this.debug_show_statistic()
  }
  @pins.get()
  @auth({ should_end_with_error: false})
  node({ req, res, options }: Pinpack) {
    if (options.auth.passed) {
      const hash = options.auth.payload['hash']
      const jwtoken = options.auth.sign({
        hash: hash
      }, null, {
        expiresIn: '1m'
      })
      res.status(200).redirect(
        url.format({
          pathname: `/${USER_ENDPOINT_STRUCT.$path}/${hash}`,
          query: {
            [TOKEN_QUERY]: BEARER_TOKEN(jwtoken)
          },
        })

      )
    } else {
      res.status(200).redirect(`/auth/login`)
    }
  }


  @pins.get(USER_API_ENDPOINT_STRUCT.me)
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

