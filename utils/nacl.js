import nacl from 'tweetnacl'
import naclUtils from 'tweetnacl-util'

export const toHex = byteArray => {
  return Array.from(byteArray, byte => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}
export const toBase64 = msg => naclUtils.encodeBase64(msg)
export const fromBase64 = msg => naclUtils.decodeBase64(msg)

export const getRandomHashB64 = length => naclUtils.encodeBase64(nacl.randomBytes(length))
export const getRandomHashHEX = length => toHex(nacl.randomBytes(length))

export const getNewKey = () => nacl.randomBytes(nacl.secretbox.keyLength)
export const getNewNonce = () => nacl.randomBytes(nacl.secretbox.nonceLength)

export const createBox = (msg, nonce, key) => {
  return naclUtils.encodeBase64(nacl.secretbox(naclUtils.decodeUTF8(msg), naclUtils.decodeBase64(nonce), naclUtils.decodeBase64(key)))
}
export const openBox = (msg, nonce, key) => {
  return naclUtils.encodeUTF8(nacl.secretbox.open(naclUtils.decodeBase64(msg), naclUtils.decodeBase64(nonce), naclUtils.decodeBase64(key)))
}

export const getHashMsg = msg => {
  return naclUtils.encodeBase64(nacl.hash(naclUtils.decodeUTF8(msg)))
}
