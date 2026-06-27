import * as hideCompanyNameHeader from './20260627_120900_hide_company_name_header'

export const migrations = [
  {
    up: hideCompanyNameHeader.up,
    down: hideCompanyNameHeader.down,
    name: '20260627_120900_hide_company_name_header',
  },
]
