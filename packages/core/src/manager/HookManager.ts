import type { IHook, IHookApplyOps } from '../types'
import type { ICliService } from '../cli/Service'
import { Logger } from '@xus/cli-shared'
import { AsyncParallelHook, AsyncSeriesWaterfallHook } from 'tapable'
import { HookTypes } from '../enums'

type IHookManagerOps = {
  service: ICliService
}

const builtinHooks = ['configReady', 'pluginsReady', 'runCmd']

const logger = new Logger(`xus:service:HookManager`)
export class HookManager {
  private service: ICliService

  private hooksMap = new Map<string, IHook[]>()

  constructor(ops: IHookManagerOps) {
    this.service = ops.service
  }

  register(hook: IHook) {
    const { name } = hook
    logger.debug(`register hook ${name}`)
    logger.debug(hook)
    // TODO: valid name fn ??
    this.hooksMap.set(name, [...(this.hooksMap.get(name) || []), hook])
  }

  // when apply to new a hook
  async apply<T = void>(ops: IHookApplyOps) {
    const { name, type } = ops
    const hooks = this.hooksMap.get(name) || []
    logger.debug(`run hook ${name} `)
    logger.debug(hooks)
    if (hooks.length < 1 && !builtinHooks.includes(name)) {
      logger.wran(`hook ${name} is empty`)
    }
    switch (type) {
      case HookTypes.event:
        // eslint-disable-next-line no-case-declarations
        const eventHook = new AsyncSeriesWaterfallHook(['_'])
        for (const hook of hooks) {
          if (this.service.PluginManager.pluginIsDisable(hook.pluginName))
            continue
          eventHook.tapPromise(
            {
              name: hook.pluginName,
              stage: hook.stage || 0,
              before: hook.before
            },
            async () => {
              await hook.fn(ops.args)
            }
          )
        }
        // no args null for tapable types check
        return (await eventHook.promise(null)) as Promise<T>

      case HookTypes.add:
        // eslint-disable-next-line no-case-declarations
        const addHook = new AsyncSeriesWaterfallHook<any[]>(['memo'])
        for (const hook of hooks) {
          if (this.service.PluginManager.pluginIsDisable(hook.pluginName))
            continue
          addHook.tapPromise(
            {
              name: hook.pluginName,
              stage: hook.stage || 0,
              before: hook.before
            },
            async (memo) => {
              const ret = await hook.fn(ops.args)
              return memo.push(ret)
            }
          )
        }
        return (await addHook.promise(ops?.initialValue || [])) as Promise<T>

      case HookTypes.serial:
        // eslint-disable-next-line no-case-declarations
        const serialHook = new AsyncSeriesWaterfallHook<any>(['memo'])
        for (const hook of hooks) {
          if (this.service.PluginManager.pluginIsDisable(hook.pluginName))
            continue
          serialHook.tapPromise(
            {
              name: hook.pluginName,
              stage: hook.stage || 0,
              before: hook.before
            },
            async (memo) => {
              return await hook.fn(memo, ops.args)
            }
          )
        }
        return (await serialHook.promise(ops?.initialValue || [])) as Promise<T>

      case HookTypes.parallel:
        // eslint-disable-next-line no-case-declarations
        const parallelHook = new AsyncParallelHook(['_'])
        for (const hook of hooks) {
          if (this.service.PluginManager.pluginIsDisable(hook.pluginName))
            continue
          parallelHook.tapPromise(
            {
              name: hook.pluginName,
              stage: hook.stage || 0,
              before: hook.before
            },
            async () => {
              return await hook.fn(ops.args)
            }
          )
        }
        // no args null for tapable types check
        return ((await parallelHook.promise(null)) as unknown) as Promise<T>

      default:
        throw new Error(`register hook.type ${type} is invalid`)
    }
  }
}

export type IHookManager = InstanceType<typeof HookManager>
