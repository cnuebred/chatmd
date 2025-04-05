import { Widget, ContainerWidget, Grid, grid_justify_content_e } from "@cnuebred/frontforge"
import { grid_widget_item_t } from "node_modules/@cnuebred/frontforge/dist/modules/grid"
import { empty_filler } from "src/utils/view"

export const page_center = (center_elements: (Widget | ContainerWidget | grid_widget_item_t  | null)[]) => {
  const row_segments = []
  center_elements.forEach(item => {
    row_segments.push([empty_filler(), item, empty_filler()])
  })

  const grid = Grid(row_segments, {
    justify_content: grid_justify_content_e.space_between,
    gridTemplateColumns: 'auto auto auto',
    column_gap: '10px',
    row_gap: '10px'
  })

  return grid
}

export const page_cleaner = () => {
  document.querySelectorAll('filler').forEach(item => item.remove()) 
}

