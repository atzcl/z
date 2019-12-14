/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 队列 job 类容器
|
*/

// eslint-disable-next-line import/no-extraneous-dependencies
import { Container } from 'injection'

import { Job } from './Bases/Job'


// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class JobsContainer {
  protected static container = new Container()

  static getAsync(name: string): Promise<Job> {
    return this.container.getAsync(name)
  }

  static bind(name: string, job: Job) {
    this.container.bind(name, job)
  }
}
