import { ForgeBundle } from "@cnuebred/frontforge/bundle"
import { hot_reload_frontend_client } from "./debug"
import path from "path"


export const COMPONENT_VIEW_PATH =
  (component_name: string, view_name: string) => {
    return path.normalize(
      `./src/view/components/${component_name}/${view_name}`
    )
  }
export const STYLE_VIEW_PATH =
  (style_name: string) => {
    return path.normalize(
      `./src/view/style/${style_name}`
    )
  }

/**
 * 
 * @param view_name 
 * example: COMPONENT_VIEW_PATH('home', 'home.view.ts')
 */
export const BUNDLE = async (view_path: string, ...styles_name: string[]) => {
  const bundle = new ForgeBundle()
  bundle.head.meta({
    content: "width=device-width, initial-scale=1.0",
    name: 'viewport'
  })
  await bundle.script(view_path)

  await bundle.style(STYLE_VIEW_PATH('theme.scss'))

  for (const style of styles_name) {
    await bundle.style(style)
  }

  await bundle.build()

  bundle.replace({
    BACKEND_ORIGIN: process.env.BACKEND_ORIGIN,
    API_VERSION: process.env.CHATMD_API_VERSION,
  })

  if (process.env.MODE == 'dev') {
    bundle.replace({
      '// @preserve HOTRELOAD_CLIENT': `(${hot_reload_frontend_client})()`,
      DEV_HOTRELOAD_SERVER_HOST: process.env.DEV_HOTRELOAD_SERVER_HOST,
      DEV_HOTRELOAD_SERVER_PORT: process.env.DEV_HOTRELOAD_SERVER_PORT
    })
  }

  return bundle
}
