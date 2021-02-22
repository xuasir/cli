import type { IPlugin, IPreset } from '../types'
import type { ICliService } from '../cli/Service'
import { Logger } from '@xus/cli-shared'

type IPluginManagerOps = {
  service: ICliService
  presets?: IPreset[]
  plugins?: IPlugin[]
}

const logger = new Logger(`xus:service:pluginManager`)
export class PluginManager {
  private service: ICliService

  protected skipPluginNames = new Set<string>()
  protected plugins: IPlugin[] = []
  protected presets: IPreset[] = []
  protected orderPlugins: IPlugin[] = []

  constructor(ops: IPluginManagerOps) {
    this.service = ops.service
    this.plugins = ops?.plugins || []
    this.presets = ops?.presets || []
  }

  resolvePluginAndPreset() {
    const finalPlugins = []
    // 1. resolve preset to plugin head
    this.presets.forEach((preset) => {
      const { plugins = [] } = preset
      finalPlugins.push(...plugins)
    })
    finalPlugins.push(...this.plugins)

    // 2. skip/deduplication/order/register config
    const prePlugins: IPlugin[] = []
    const normalPlugins: IPlugin[] = []
    const postPlugins: IPlugin[] = []
    const hashMap = new Map<string, boolean>()
    finalPlugins.forEach((plugin) => {
      const { name } = plugin
      if (
        !hashMap.get(name) &&
        !this.skipPluginNames.has(name) &&
        this.isValidPlugin(plugin)
      ) {
        // register config
        if (plugin?.config) {
          this.service.ConfigManager.registerPluginConfig(name, plugin.config)
        }
        // order plugin by enforce
        if (plugin?.enforce === 'post') postPlugins.push(plugin)
        else if (plugin?.enforce === 'pre') prePlugins.push(plugin)
        else normalPlugins.push(plugin)
      }
      hashMap.set(name, true)
    })

    this.orderPlugins = [...prePlugins, ...normalPlugins, ...postPlugins]

    logger.debug(`order plugins`)
    logger.debug(this.orderPlugins)
  }

  private isValidPlugin(plugin: IPlugin) {
    return typeof plugin.name === 'string' && typeof plugin.apply === 'function'
  }

  applyPlugins() {
    this.orderPlugins.forEach((plugin) => {
      const { name, apply } = plugin
      const api = this.service.getPluginAPI({ pluginName: name })
      try {
        apply(api)
      } catch (e) {
        throw new Error(`plugin ${name} apply error, ${e.message}`)
      }
    })

    logger.debug(`apply plugins success`)
  }

  pluginIsEnable(pluginName: string) {
    // custom skip
    if (this.skipPluginNames.has(pluginName)) return false

    // config set to false
    const pluginConfig =
      this.service.ConfigManager.projectConfig[pluginName] || null
    if (pluginConfig === false) return false

    // TODO: plugin enableBy ??
  }

  // for plugin api
  skipPlugin(pluginName: string) {
    this.skipPluginNames.add(pluginName)
  }
}

export type IPluginManager = InstanceType<typeof PluginManager>
