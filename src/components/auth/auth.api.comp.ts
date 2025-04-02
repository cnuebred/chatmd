import { ForgeBundle } from "@cnuebred/frontforge/bundle"
import { auth, need, Pinpack, pins, PinupController, reply } from "pinup"
import { API_URL } from "../../utils/resolver"
import { login_method_e, PrismaClient } from '@prisma/client'
import {
  BEARER_TOKEN,
  DISCORD_OAUTH_AUTHORIZE_TOKEN_URL,
  DISCORD_USER_URL,
  GITHUB_OAUTH_ACCESS_TOKEN_URL,
  GITHUB_USER_URL,
  NOTIFY_QUERY,
  TOKEN_QUERY,
  URL_NOTIFY_ACTIONS_NAMETAGS
} from "../../const"
import { prisma_client_error_handler } from "../../database/error_handler"
import { createHash, randomBytes } from "crypto"
import { discord_api_user_t, github_api_user_t } from "./auth"
import { is_account_exist, save_account_before_created_via_service } from "./auth.resolver"
import { AuthType } from "pinup/dist/d"


export const endpoint_struct = {
  $path: API_URL(''),
  auth: 'auth',
  login: 'login',
  register: 'register',
  min10: '10min',
  github_auth: 'github',
  discord_auth: 'discord',
}

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
    this.path = endpoint_struct.$path
    this.debug_show_statistic()
  }
  @pins.get(endpoint_struct.auth)
  @auth({ should_end_with_error: true })
  async auth({ req, res, options }: Pinpack) {
    const hash = options.auth.payload['hash']
    const jwtoken = options.auth.sign({
      hash: hash
    })
    return res.send(reply({
      msg: 'refresh auth',
      data: {
        token: jwtoken
      },
      status: 200,
    }
    ))
  }
  @pins.get(endpoint_struct.login)
  async login({ req, res, options }: Pinpack) {
    return res.send(reply('COMMING SOON'))
  }
  @pins.get(endpoint_struct.register)
  register({ req, res, options }: Pinpack) {
    return res.send(reply('COMMING SOON'))
  }
  @pins.get(endpoint_struct.min10)
  min10({ req, res, options }: Pinpack) {
    return res.send(reply('COMMING SOON'))
  }
  @pins.get(endpoint_struct.github_auth)
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
      return res.redirect('/auth/login') // TODO with status fail
    }

    const data = await response.json()
    const hash = get_github_hash(data)

    const user_exist = await is_account_exist(hash)
    if (!user_exist) {
      const status = await save_account_before_created_via_service(hash, 'GITHUB', data)

      if (status == null) {
        return res.redirect(
          `/auth/login?${NOTIFY_QUERY}=${URL_NOTIFY_ACTIONS_NAMETAGS.fail}`
        )
      } else {
        return res.redirect(
          `/auth/login?${NOTIFY_QUERY}=${URL_NOTIFY_ACTIONS_NAMETAGS.successful_create_account
          }`
        )
      }
    } else {
      const jwt = options.auth.sign({
        hash: hash
      }, null, {
        expiresIn: '1m',
      })
      return res.redirect(`/u?${TOKEN_QUERY}=${BEARER_TOKEN} ${jwt}`)
    }

  }
  @pins.get(endpoint_struct.discord_auth)
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

