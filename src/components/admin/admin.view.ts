import { Widget, ContainerWidget, Grid } from "@cnuebred/frontforge"

const header = new ContainerWidget()

const title = new Widget('h1.main_header', 'CORE')

header.add(title)

header.hook('app')
