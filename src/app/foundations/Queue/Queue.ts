/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 创建异步队列
|
*/

// eslint-disable-next-line object-curly-newline
import { provide, scope, ScopeEnum, init, config, plugin, EggLogger, EggAppConfig } from 'midway'
import * as BullQueue from 'bull'

import { JobsContainer } from './Container'


type TClients = 'dingtalk' | 'send'

interface TClientsOption {
  name: TClients;
  redis?: BullQueue.QueueOptions['redis'];
}

declare global {
  interface QueueJobs {
    //
  }
}


// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQueue extends BullQueue.Queue {
  // todo: 函数重载
  dispatch: <N extends keyof QueueJobs>(name: N, data?: QueueJobs[N], opts?: BullQueue.JobOptions) => void;
}

export const CONTAINER_NAME = 'queue'

@scope(ScopeEnum.Singleton) // Singleton 单例，全局唯一（进程级别）
@provide(CONTAINER_NAME)
export class Queue {
  @config('myApp')
  myAppConfig!: EggAppConfig['myApp']

  @plugin('logger')
  readonly logger!: EggLogger

  readonly clients = {} as {
    [k in TClients ]: IQueue
  }

  @init()
  create() {
    const { queue } = this.myAppConfig;

    if (!queue.enable) {
      return;
    }

    const clients = [
      { name: 'dingtalk', redis: queue.redis },
      { name: 'send' },
    ] as TClientsOption[]

    clients.forEach(client => this.makeClient(client))
  }

  /**
   * 创建队列实例
   *
   * @param {TClientsOption} clientOpt 创建队列实例的参数
   */
  protected makeClient(clientOpt: TClientsOption) {
    const { name, redis = this.myAppConfig.queue.redis } = clientOpt

    const current = new BullQueue(name, { redis }) as IQueue

    /**
     * 队列任务生产者
     */
    // eslint-disable-next-line @typescript-eslint/no-extra-parens
    current.dispatch = async (jobName, data, options) => (
      current.add({ name: jobName, data, options }, options)
    )


    /**
     * 队列任务消费者
     */
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    current.process(async (job, done) => {
      const { name: jobName, ...last } = job.data

      return this.handleJob(jobName, last)
        .then(() => done())
        .catch(done)
    })

    current.on('error', (error: Error) => {
      this.logger.error(() => `job: ${name}: ${error.name} ${error.message}`)
      process.exit(1)
    })

    this.clients[name] = current
  }

  /**
   * 分发到对应 job
   *
   * @param {string} jobName job 在容器中的 id
   * @param {object} payload 传递的数据，因为 bull 是将传递的数据 JSON.stringify 后储存到 redis 里的，所以只能传递基础数据
   *
   * @returns {Promise<void>}
   */
  protected async handleJob(jobName: string, payload: any = {}) {
    const { data, options } = payload

    const jobClass = await JobsContainer.getAsync(jobName)
    return jobClass ? jobClass.handle(data, options) : Promise.reject()
  }
}
