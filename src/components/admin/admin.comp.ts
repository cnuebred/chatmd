import { need, Pinpack, pins, PinupController, reply } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/dist/bundle'

export class Admin extends PinupController{
  async $init() {
    this.path = 'admin'
    const bundle = new ForgeBundle()
    bundle.head.meta({
      content: "width=device-width, initial-scale=1.0",
      name: 'viewport'
    })
    await bundle.script('./src/components/admin/admin.view.ts')
    await bundle.build('./index.html')

    this.debug_show_statistic()
  }
  @pins.get('ok')
  admin_view({ rec, rep, options }: Pinpack) {
    console.log(options)
    
    options.pin.log('Admin view')
    return rep.status(200).sendFile('/mnt/d/dev/js/chatmd/index.html')
  }

  @pins.get()
  @need.headers(['token'])
  get_list_({ rec, rep, options }: Pinpack) {
    console.log(options)
    options.pin.log('Here is log about how to get list')
    return options.pin.res(reply('ok'))
  }
}