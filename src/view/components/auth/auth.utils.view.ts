import { ContainerWidget, Widget } from "@cnuebred/frontforge"

export const login_by_github_button = () => {
  const login_by_github = new ContainerWidget('button.font-mono.block_center')
  login_by_github.add(new Widget('icon.github-button'))
  login_by_github.add(new Widget('span.font-mono.t_center', 'github'))
  login_by_github.event('click', async () => {
    const query = [
      `client_id=GITHUB_AUTH_CLIENT_ID`,
      `scope=${"user:email"}`
    ]
    const auth_url = new URL(
      `GITHUB_OAUTH_AUTHORIZE_URL?${query.join('&')}`
    )

    window.location.href = auth_url.toString()
  })
  return login_by_github
}
export const login_by_discord_button = () => {
  const login_by_discord = new ContainerWidget('button.font-mono.block_center')
  login_by_discord.add(new Widget('icon.discord-button'))
  login_by_discord.add(new Widget('span.font-mono.t_center', 'discord'))
  login_by_discord.event('click', async () => {
    const query = [
      `client_id=DISCORD_AUTH_CLIENT_ID`,
      `response_type=code`,
      `redirect_uri=${encodeURIComponent('DISCORD_OAUTH_REDIRECT_URL')}`,
      `scope=identify`,
    ]
    const auth_url = new URL(
      `DISCORD_OAUTH_AUTHORIZE_URL?${query.join('&')}`
    )

    window.location.href = auth_url.toString()
  })
  return login_by_discord
}

