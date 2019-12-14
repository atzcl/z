import { createHmac } from 'crypto'

import * as dayjs from 'dayjs'


// type Sha256Encoding = 'utf8' | 'ascii' | 'latin1'

type HexBase64Latin1Encoding = 'latin1' | 'hex' | 'base64'


export const getTimestamp = () => dayjs().valueOf()

// eslint-disable-next-line @typescript-eslint/no-extra-parens
export const sha256 = (key: string, str: string, encoding: HexBase64Latin1Encoding = 'hex') => (
  createHmac('sha256', key)
    .update(str, 'utf8')
    .digest(encoding)
)

export const base64 = (str: string) => Buffer.from(str, 'utf-8').toString('base64')
