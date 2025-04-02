import { ForgeBundle } from "@cnuebred/frontforge/bundle"
import { hot_reload_frontend_client } from "./debug"

/**
 * 
 * @param view_name 
 * example: 'home.view.ts'
 * @param dirname
 * example: eq `__dirname` 
 */
export const BUNDLE = async ( dirname: string, view_name: string, ...styles_name: string[]) => {
  const bundle = new ForgeBundle()
  bundle.head.meta({
    content: "width=device-width, initial-scale=1.0",
    name: 'viewport'
  })
  await bundle.script(`${dirname}/${view_name}`)
  
  await bundle.style(`./src/view/style/theme.scss`)

  for(const style of styles_name){
    await bundle.style(`${dirname}/${style}`)
  }

  await bundle.build()

  if (process.env.MODE == 'dev'){
    bundle.replace({
      '// @preserve HOTRELOAD_CLIENT': `(${hot_reload_frontend_client})()`,
      DEV_HOTRELOAD_SERVER_HOST: process.env.DEV_HOTRELOAD_SERVER_HOST,
      DEV_HOTRELOAD_SERVER_PORT: process.env.DEV_HOTRELOAD_SERVER_PORT
    })
  }

  return bundle
}
