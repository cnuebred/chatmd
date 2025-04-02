import {WebSocket as NodeWebSocket} from  "ws";

 /**
  * do stuffs only if you're in dev mode
  * @param callback 
  * @returns 
  */
export const ifdev = (callback: () => void) => {
  if (process.env.MODE != 'dev'){
    return
  }
  callback()
}

 /**
  * hot reload emitter - send 'reload' command only after restart server
  * @returns 
  */
export const hot_reload_backend_client = () => {
  setTimeout(
    () => {
      const wss = new NodeWebSocket(
        `ws://${process.env.DEV_HOTRELOAD_SERVER_HOST}` +
        `:${process.env.DEV_HOTRELOAD_SERVER_PORT}`
      )
      wss.on('open', () => {
        wss.send("reload")
      })
    },
    700
  )

}

 /**
  * hot reload receiver - must be different name then Node websocket due
  * string interpreter
  * @returns 
  */
export const hot_reload_frontend_client = () => {
  const wss = new WebSocket(
    `ws://DEV_HOTRELOAD_SERVER_HOST:DEV_HOTRELOAD_SERVER_PORT`
  )  
  wss.onmessage = (event) => {
    if (event.data == "reload") {
        location.reload()
    }
  }
}