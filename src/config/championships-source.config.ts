import type { FootballFormat } from '@/config/football-format'

export type ChampionshipSheetPurpose = 'championships' | 'matches'

export type ChampionshipSheetConfig = {
  readonly key: string
  readonly gid: string
  readonly format: FootballFormat
  readonly purpose: ChampionshipSheetPurpose
  readonly headerInColumns: boolean
}

export const CHAMPIONSHIPS_SPREADSHEET_ID = '1SDQgD6adhje5JFokdqNmGQYA0VQrqBKeWOvtAcI53bo'

export const CHAMPIONSHIPS_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${CHAMPIONSHIPS_SPREADSHEET_ID}/edit`

export const CHAMPIONSHIP_SHEETS: readonly ChampionshipSheetConfig[] = [
  {
    key: 'f8-championships',
    gid: '1515588434',
    format: 'f8',
    purpose: 'championships',
    headerInColumns: false,
  },
  {
    key: 'f8-matches',
    gid: '427464350',
    format: 'f8',
    purpose: 'matches',
    headerInColumns: true,
  },
  {
    key: 'f5-championships',
    gid: '1191761422',
    format: 'f5',
    purpose: 'championships',
    headerInColumns: false,
  },
  {
    key: 'f5-matches',
    gid: '880695400',
    format: 'f5',
    purpose: 'matches',
    headerInColumns: true,
  },
]
