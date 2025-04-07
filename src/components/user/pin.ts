import { auth, need, Pinpack, pins, PinupController } from "pinup";
import { ForgeBundle } from '@cnuebred/frontforge/bundle'
import { BUNDLE, COMPONENT_VIEW_PATH, STYLE_VIEW_PATH } from '../../utils/bundle'
import path from "path";
import { TOKEN_QUERY, USER_ENDPOINT_STRUCT, USER_NEED_PARAMS } from "../../const";
import { UserApi } from "./api.pin";



const view_files = {
  user: 'user.node.view.ts',
  profile: 'user.profile.view.ts',
}

export class User extends PinupController {
  view: Record<keyof typeof view_files, ForgeBundle | null> = {
    user: null,
    profile: null,
  }
  async $init() {
    this.path = USER_ENDPOINT_STRUCT.$path
    this.pin(UserApi)
    this.files(path.resolve('./src/view/assets'), 'view/assets')
    this.view.profile = await BUNDLE(
      COMPONENT_VIEW_PATH(this.path, view_files.profile),
      STYLE_VIEW_PATH('user.scss')
    )
    this.view.user = await BUNDLE(
      COMPONENT_VIEW_PATH(this.path, view_files.user),
      STYLE_VIEW_PATH('user.scss')
    )

    this.debug_show_statistic()
  }
  @pins.get('')
  main_view({ res }: Pinpack) {
    return res.status(200).send(this.view.user.html)
  }

  @pins.get(USER_ENDPOINT_STRUCT.profile)
  @need.params([USER_NEED_PARAMS.user_hash])
  @auth({ should_end_with_error: false, data_source: 'query', data_name: TOKEN_QUERY })
  profile_view({ req, res, options }: Pinpack) {
    return res.status(200).send(this.view.profile.html)
  }
}

