import { ForgeBundle } from "@cnuebred/frontforge/bundle"
import { auth, need, Pinpack, pins, PinupController, reply } from "pinup"
import { API_URL } from "../../utils/endpointer"
import {
  AUTH_API_ENDPOINT_STRUCT,
  BEARER_TOKEN,
  DISCORD_OAUTH_AUTHORIZE_TOKEN_URL,
  DISCORD_USER_URL,
  GITHUB_OAUTH_ACCESS_TOKEN_URL,
  GITHUB_USER_URL,
  TOKEN_QUERY,
  USER_ENDPOINT_STRUCT,
} from "../../const"
import { createHash} from "crypto"
import { discord_api_user_t, github_api_user_t } from "./d"
import { is_account_exist, save_account_before_created_via_service } from "./resolver"
import { AuthType } from "pinup/dist/d"



export const get_discord_hash = (data: discord_api_user_t) => {
  const hash = createHash('sha256')
  hash.update(`${data.id}_${data.username}`)
  return hash.digest('hex')
}

export const get_github_hash = (data: github_api_user_t) => {
  const hash = createHash('sha256')
  hash.update(`${data.node_id}`)
  return hash.digest('hex')
}


export const refresh_jwtoken = (auth: AuthType) => {
  if (auth.passed) {
    const hash = auth.payload['hash']
    const jwtoken = auth.sign({
      hash: hash
    })
  }
}

export class AuthApi extends PinupController {
  view: { [index: string]: ForgeBundle } = {
    main_admin_panel_view: null
  }
  async $init() {
    this.path = AUTH_API_ENDPOINT_STRUCT.$path
    this.debug_show_statistic()
  }
  @pins.get(AUTH_API_ENDPOINT_STRUCT.auth)
  @auth({ should_end_with_error: true })
  async auth({ req, res, options }: Pinpack) {
    const hash = options.auth.payload['hash']
    const jwtoken = options.auth.sign({
      hash: hash
    })
    return res.send(reply({
      msg: 'refresh auth',
      data: {
        jwtoken: BEARER_TOKEN(jwtoken)
      },
      status: 200,
    }
    ))
  }
  @pins.get(AUTH_API_ENDPOINT_STRUCT.login)
  async login({ req, res, options }: Pinpack) {
    return res.send(reply('COMMING SOON'))
  }
  @pins.get(AUTH_API_ENDPOINT_STRUCT.register)
  register({ req, res, options }: Pinpack) {
    return res.send(reply('COMMING SOON'))
  }
  @pins.get(AUTH_API_ENDPOINT_STRUCT.min10)
  min10({ req, res, options }: Pinpack) {
    return res.send(reply('COMMING SOON'))
  }
  @pins.get(AUTH_API_ENDPOINT_STRUCT.github_auth)
  @need.query(['code'])
  async github_auth({ req, res, options }: Pinpack) {
    const query = [
      `client_id=${process.env.GITHUB_AUTH_CLIENT_ID}`,
      `client_secret=${process.env.GITHUB_AUTH_CLIENT_SECRET}`,
      `code=${options.query.code}`,
    ]
    let response = await fetch(
      new URL(`${GITHUB_OAUTH_ACCESS_TOKEN_URL}?${query.join('&')}`),
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      }
    )

    if (!response.ok) {
      return res.redirect('/auth/register?ok=false') // TODO
    }

    const oauth_data_pack = await response.json()

    response = await fetch(
      new URL(GITHUB_USER_URL),
      {
        method: 'GET',
        headers: {
          'Authorization':
            `${oauth_data_pack.token_type} ${oauth_data_pack.access_token}`
        }
      }
    )

    if (!response.ok) {
      return res.redirect('/auth/login')
    }

    const data = await response.json()
    const hash = get_github_hash(data)

    const user_exist = await is_account_exist(hash)
    if (!user_exist) {
        await save_account_before_created_via_service(hash, 'GITHUB', data)

        return res.redirect(
          `/auth/login`
        )
    } else {
      const jwt = options.auth.sign({
        hash: hash
      }, null, {
        expiresIn: '1m',
      })
      return res.redirect(`/${USER_ENDPOINT_STRUCT.$path}?${TOKEN_QUERY}=${BEARER_TOKEN(jwt)}`)
    }

  }
  @pins.get(AUTH_API_ENDPOINT_STRUCT.discord_auth)
  @need.query(['code'])
  async discord_auth({ req, res, options }: Pinpack) {
    const body = new URLSearchParams({
      client_id: process.env.DISCORD_AUTH_CLIENT_ID,
      client_secret: process.env.DISCORD_AUTH_CLIENT_SECRET,
      code: options.query.code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.DISCORD_OAUTH_REDIRECT_URL,
      scope: 'identify'
    });

    let response = await fetch(
      new URL(DISCORD_OAUTH_AUTHORIZE_TOKEN_URL),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
      }
    )

    if (!response.ok) {
      return res.redirect('/auth/login?status=failed_login') // TODO
    }

    const oauth_data_pack = await response.json()
    response = await fetch(
      new URL(DISCORD_USER_URL),
      {
        method: 'GET',
        headers: {
          'authorization':
            `${oauth_data_pack.token_type} ${oauth_data_pack.access_token}`
        }
      }
    )
    const data = await response.json()
    console.log(get_discord_hash(data))


    if (!response.ok) {
      return res.redirect('/auth/login?status=failed_login') // TODO
    } else {
      return res.redirect('/p/<username>') // TODO
    }
  }
}

