
// env_names

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
export const TOKEN_QUERY = 'token'
export const BEARER_TOKEN = 'Bearer'

// notification timeout
export const TIMEOUT_NOTIFICATION_LIFESPAN_MS
  = 15000

// url query actions
// openssl rand -hex 8
export const URL_NOTIFY_ACTIONS_NAMETAGS ={
  successful_create_account: 'c75a2688825c531c',
  success: 'da81c0cafb642a97',
  fail: 'ffdabd757a1eaa9f'
}


// public errors - communicates 
export const SERVICE_ERRORS = {

}