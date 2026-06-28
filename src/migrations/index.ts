import * as hideCompanyNameHeader from './20260627_120900_hide_company_name_header'
import * as addBlockDesignControlColumns from './20260627_185600_add_block_design_control_columns'
import * as addBlockHiddenColumns from './20260627_231500_add_block_hidden_columns'

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
  {
    up: addBlockHiddenColumns.up,
    down: addBlockHiddenColumns.down,
    name: '20260627_231500_add_block_hidden_columns',
  },
]
