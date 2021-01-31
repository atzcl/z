import { createHmac, BinaryToTextEncoding } from 'crypto'

import * as dayjs from 'dayjs'

export const getTimestamp = () => dayjs().valueOf()

// eslint-disable-next-line @typescript-eslint/no-extra-parens
export const sha256 = (
  key: string,
  str: string,
  encoding: BinaryToTextEncoding = 'hex'
) => createHmac('sha256', key).update(str, 'utf8').digest(encoding)

export const base64 = (str: string) =>
  Buffer.from(str, 'utf-8').toString('base64')
