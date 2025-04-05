import { Widget } from "@cnuebred/frontforge"
import { TIMEOUT_NOTIFICATION_LIFESPAN_MS} from "src/const"

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
