import { provide, Job } from '@app/foundations/Queue'
import { ExceptionNotify, Config } from '@app/foundations/Exceptions/Handles/Notify'
import { Dingtalk } from '@app/foundations/Dingtalk'


const JOB_NAME = 'exceptionNotify'

// 这里分离，是为了在 vs code 上得到更好的智能提示信息
export interface QueueJobItems {
  [JOB_NAME]: {
    error: Error,
    config: Config,
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface QueueJobs extends QueueJobItems {
    //
  }
}


@provide(JOB_NAME)
export class GitProjectDeploy extends Job {
  async handle(data: QueueJobItems['exceptionNotify']) {
    const { error, config } = data

    const accessToken = '066ec14b0f3b5ce1a9901a62d5ac9f1d5eb34d8e1c85fa543cb99efa4b262459'

    const secret = 'SECc8587bc4118b0049dcfa514e539b6dff1ec716c1de37d75ccadd9aa8eac93fcc'

    const dingtalk = new Dingtalk(accessToken, secret)

    await new ExceptionNotify({ dingtalk }).handler(error, config)
  }
}
