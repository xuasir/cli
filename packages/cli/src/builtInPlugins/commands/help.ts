import { IPluginAPI } from '../../PluginAPI'

export default function (api: IPluginAPI): void {
  api.registerCommand('help', (args) => {
    console.log(`args `, args)
    console.log(`all command `, Object.keys(api.commands))
  })
}
