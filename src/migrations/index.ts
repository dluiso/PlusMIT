import * as hideCompanyNameHeader from './20260627_120900_hide_company_name_header'
import * as addBlockDesignControlColumns from './20260627_185600_add_block_design_control_columns'

export const migrations = [
  {
    up: hideCompanyNameHeader.up,
    down: hideCompanyNameHeader.down,
    name: '20260627_120900_hide_company_name_header',
  },
  {
    up: addBlockDesignControlColumns.up,
    down: addBlockDesignControlColumns.down,
    name: '20260627_185600_add_block_design_control_columns',
  },
]
