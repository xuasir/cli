import { HookTypes } from '../enums'

// hooks
export interface IHook {
  // hooks name only key
  name: string
  // register from which plugin
  pluginName: string
  fn: (...args: any[]) => any
  // for call order based on tapable
  stage?: number
  before?: string
}
export interface IHookApplyOps {
  name: string
  type: HookTypes
  initialValue?: any
  args?: any
}
