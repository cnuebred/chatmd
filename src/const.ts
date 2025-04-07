
// env_names

import { API_URL } from "./utils/endpointer"

export const GITHUB_AUTH_CLIENT_ID =
  'GITHUB_AUTH_CLIENT_ID'
export const GITHUB_AUTH_CLIENT_SECRET =
  'GITHUB_AUTH_CLIENT_SECRET'
export const DISCORD_AUTH_CLIENT_ID =
  'DISCORD_AUTH_CLIENT_ID'
export const DISCORD_OAUTH_REDIRECT_URL =
  'DISCORD_OAUTH_REDIRECT_URL'
export const DISCORD_AUTH_CLIENT_SECRET =
  'DISCORD_AUTH_CLIENT_SECRET'


// consts values
export const GITHUB_OAUTH_ACCESS_TOKEN_URL =
  'https://github.com/login/oauth/access_token'
export const GITHUB_OAUTH_AUTHORIZE_URL =
  'https://github.com/login/oauth/authorize'
export const GITHUB_USER_URL =
  'https://api.github.com/user'

export const DISCORD_OAUTH_AUTHORIZE_URL =
  'https://discord.com/oauth2/authorize'

export const DISCORD_OAUTH_AUTHORIZE_TOKEN_URL =
  'https://discord.com/api/oauth2/token'
export const DISCORD_USER_URL =
  'https://discord.com/api/users/@me'


// queries
export const NOTIFY_QUERY = 'notify'
export const ERROR_CODE_QUERY = 'error_code'
export const TOKEN_QUERY = 'jwtoken'
export const BEARER_TOKEN = (jwt) => `Bearer ${jwt}`

// notification timeout
export const TIMEOUT_NOTIFICATION_LIFESPAN_MS
  = 15000


// endpoints structs

export const AUTH_API_ENDPOINT_STRUCT = {
  $path: API_URL(''),
  auth: 'auth',
  login: 'login',
  register: 'register',
  min10: '10min',
  github_auth: 'github',
  discord_auth: 'discord',
}

export const AUTH_ENDPOINT_STRUCT = {
  $path: 'auth',
  login: 'login',
  register: 'register',
  min10: '10min',
}

export  const USER_NEED_PARAMS = {
  user_hash: 'user_hash'
}
export const USER_ENDPOINT_STRUCT = {
  $path: 'user',
  profile: `:${USER_NEED_PARAMS.user_hash}`,
}

export const USER_API_ENDPOINT_STRUCT = {
  $path: API_URL(''),
  user: 'user',
  me: `me`,
}