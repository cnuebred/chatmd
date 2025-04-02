import { Widget } from "@cnuebred/frontforge"
import { TIMEOUT_NOTIFICATION_LIFESPAN_MS, URL_NOTIFY_ACTIONS_NAMETAGS } from "src/const"

export enum basic_signal_colors_e {
  RED = '#FF8989',
  BLUE = '#667BC6',
  YELLOW = '#F6FB7A',
  GREEN_LIGHT = '#B4E380',
  GREEN = '#90B566',
}


export const notify = (info: string, color: basic_signal_colors_e) => {
  const banner = new Widget('div.font-mono.notify_banner')

  banner.content = info
  banner.style.border = `2.5px ${color} solid`
  
  banner.render()

  const banner_element = banner.clone().self
  setTimeout(() => {banner_element.remove()}, TIMEOUT_NOTIFICATION_LIFESPAN_MS)

  document.querySelector('body').append(banner_element)
}

export const is_notify_eq_action = (
  url: URL,
  action: (typeof URL_NOTIFY_ACTIONS_NAMETAGS)[keyof typeof URL_NOTIFY_ACTIONS_NAMETAGS]
):boolean => {
  return url.searchParams.get('NOTIFY_QUERY') == action
}

export const send_url_notify = (
  url: URL,
  info: string,
  color: basic_signal_colors_e,
) => {
  notify(info, color)
  url.searchParams.delete('NOTIFY_QUERY')
  url.searchParams.delete('ERROR_CODE_QUERY')
  window.history.pushState('-', '-', url.href);
}