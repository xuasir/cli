// cli service lifycycle
export enum CliServiceStage {
  uninstalled = 0,
  constructor,
  initManager,
  initUserConfig,
  resolvePluginAndPresets,
  setupCli,
  initPluginConfig,
  validConfig,
  applyPlugins,
  runCmd
}

export enum HookTypes {
  // event emit
  event = 'event',
  // return to next
  serial = 'serial',
  // same time to run
  parallel = 'parallel',
  // save return to arrary
  add = 'add'
}
