import { customAlphabet } from 'nanoid'

const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const nanoid = customAlphabet(alphabet, 8)

export function generatePlayerId(): string {
  return `PLR_${nanoid()}`
}

export function isValidPlayerId(playerId: string): boolean {
  return /^PLR_[0-9A-HJKMNP-TV-Z]{8}$/.test(playerId)
}
