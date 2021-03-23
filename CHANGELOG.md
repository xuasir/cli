### `2021-03-23`

**Bug Fixes**

- 错误执行两次write [3b4df3](https://github.com/xus-code/bundle-tools/commit/3b4df33d67bc2bcc94cfa484cb5fd945f5afc7e7)
- 导出createXusConfig [fa2aa7](https://github.com/xus-code/bundle-tools/commit/fa2aa7bc3079137c6ee5fd456e7e85d86eeb69d7)
- 调整项目结构 [b20982](https://github.com/xus-code/bundle-tools/commit/b20982401547c20e869cf57326570b7ee34f2ee8)
- 调整js处理顺序 [fa094c](https://github.com/xus-code/bundle-tools/commit/fa094cab9fb4a410d07ad298c16f39388f80d37e)
- 调整order算法 [3658c0](https://github.com/xus-code/bundle-tools/commit/3658c0edbe6cbab98d37517d821b46725457e31d)
- 发布分支分支支持可配置 [426ad0](https://github.com/xus-code/bundle-tools/commit/426ad028e83ad7f60adcd6cfcf68c646291a8e89)
- 更好的打包过程展示 [e673b0](https://github.com/xus-code/bundle-tools/commit/e673b0768e4c0e83e980bd53ed86cf73507769d2)
- 更新roll-chain版本 [4c1e5e](https://github.com/xus-code/bundle-tools/commit/4c1e5eaea5d18561e00a12b0cbb87ae3cb39155b)
- 忽略循环依赖warning [fb837e](https://github.com/xus-code/bundle-tools/commit/fb837ed0f81382c65cbddc24b6c56d2c60c81682)
- 兼容独立编译模式 [b8af74](https://github.com/xus-code/bundle-tools/commit/b8af74457b817cce1e649ff3ad6761f6410494ee)
- 将默认targets交由代码阶段赋值 [853e29](https://github.com/xus-code/bundle-tools/commit/853e29504055e702c3426d5ffe7b9cc20cc30dfc)
- 将内部方法增加$前缀 [adad67](https://github.com/xus-code/bundle-tools/commit/adad67a9f89928a1ee1ec497413d1309619c59cc)
- 去除ctx设置能力统一采用cwd [e5714e](https://github.com/xus-code/bundle-tools/commit/e5714e05ecd5c7def9954fa891c8a8e7e10a92cf)
- 深度可选config [cc01c4](https://github.com/xus-code/bundle-tools/commit/cc01c413067bad19e88baa105f1a052f45bb8d8b)
- 修复esbuildregister失效 [05a00b](https://github.com/xus-code/bundle-tools/commit/05a00b1ca5342677ff7f15a794a1754d8e32455e)
- 修复js-compiler构建问题 [13ca46](https://github.com/xus-code/bundle-tools/commit/13ca469190b0db717e5caf0690949543f94594c9)
- 修复release输出文字 [54d1c0](https://github.com/xus-code/bundle-tools/commit/54d1c0ff90cc3fdc150a4538ebf37a7d502db4dc)
- 修复release在单包模式下路径错误 [65ba8b](https://github.com/xus-code/bundle-tools/commit/65ba8b1437699502e8496d2a4c96cc6d1378be60)
- 修改create-lib状态 [518965](https://github.com/xus-code/bundle-tools/commit/51896548b091f6b53994f1160637b0ef80514f33)
- 修正快捷注册方法的类型推导 [2b776d](https://github.com/xus-code/bundle-tools/commit/2b776d16039fd21e4eeec28be9500773eeeb4cab)
- 修正类型 [7ff9fd](https://github.com/xus-code/bundle-tools/commit/7ff9fd049b7cd461b4e8e97c90e96f5a41114eff)
- 修正config类型 [bd1723](https://github.com/xus-code/bundle-tools/commit/bd1723d4ad3784521338af3fd85e784bb009c664)
- 修正help输出格式 [45d9de](https://github.com/xus-code/bundle-tools/commit/45d9decdff89034eba9a7771939cf4015c9483a2)
- 修正Hook和Plugin类型 [7fc57f](https://github.com/xus-code/bundle-tools/commit/7fc57f9e85513e8426e88cfed61659bbe24f9c43)
- 增量生成changelog [23375c](https://github.com/xus-code/bundle-tools/commit/23375ce742ad9e2e99fbe86e86aabe5846e3d252)
- 整理rollup插件的导出形式 [2618d8](https://github.com/xus-code/bundle-tools/commit/2618d8f741d40c340eeb133a04e50cc51b7b04a9)
- create-lib不再主动安装依赖 [3fb09b](https://github.com/xus-code/bundle-tools/commit/3fb09b8ba50fedec062ed6f6c516858909a14df5)
- create-lib去除和cli的耦合 [136420](https://github.com/xus-code/bundle-tools/commit/136420c6c001fb7c429209d0d3899cd506740921)
- env管理器获取env错误 [a22746](https://github.com/xus-code/bundle-tools/commit/a2274635a43bb93dfc0293f6e556a1c838e6573e)
- release没有await runCmd [3b421b](https://github.com/xus-code/bundle-tools/commit/3b421b477617f3b88bb3b1a8be9c1cf5fde27df1)
- rollup types文件后删除不必的文件和文件夹 [068c02](https://github.com/xus-code/bundle-tools/commit/068c0233861d639433de894c8316e1bcd36ee872)

**Document**

- 增加readme [cd5acd](https://github.com/xus-code/bundle-tools/commit/cd5acdcef56cef691cb90fb37ad0f0fe1e8f8441)
- readme [f50d55](https://github.com/xus-code/bundle-tools/commit/f50d554d039056a654738c2d531ccdecce22c57b)

**Feature**

- 暴露getCmdArgs供给api [76ce0b](https://github.com/xus-code/bundle-tools/commit/76ce0b8fc7a41dc8488d30b60b7879d93a052d7e)
- 导出创建rollupchain函数供配置文件语法提示 [ab2eb8](https://github.com/xus-code/bundle-tools/commit/ab2eb86d1f89704178d164fe2feab0c69b024184)
- 更换babelRegister为esbuildRegister [03a1e9](https://github.com/xus-code/bundle-tools/commit/03a1e940675d883c3bc090c07d76e486bf6b0953)
- 基于插件的cli初步实现 [4bac79](https://github.com/xus-code/bundle-tools/commit/4bac7958da8e377ee909a627e0b8d10e75b698e5)
- 生产模式下自动开启sourceMap [30eacf](https://github.com/xus-code/bundle-tools/commit/30eacf7a8926d311780d36f96103f5e28c0091bc)
- 添加create指令 [1948c7](https://github.com/xus-code/bundle-tools/commit/1948c7349a06a76230e38a18dafd1686146d51ca)
- 添加json解析插件 [08e597](https://github.com/xus-code/bundle-tools/commit/08e5971dbda0ce72123b69fbdd7f23ebf7b97a3a)
- 添加lerna模板 [b46225](https://github.com/xus-code/bundle-tools/commit/b46225fa73401d627ec8593b6ae55a7dc01072c2)
- 添加postcss插件 [10ae08](https://github.com/xus-code/bundle-tools/commit/10ae089e8ce0eeb1a053e1f34041c5a2088d4dfc)
- 添加type打包 [8e7d1b](https://github.com/xus-code/bundle-tools/commit/8e7d1bd47662ce98034a781f6a2d50070cce97a4)
- 添加vue jsx demo [bd55bd](https://github.com/xus-code/bundle-tools/commit/bd55bd6c1510c703a150e44356a6f801f20042e7)
- 添加watch模式 [66f4f4](https://github.com/xus-code/bundle-tools/commit/66f4f46d703d69c1a6fbcc266d1619d457945667)
- 新增changelog,lint,release,clean指令 [30fbfc](https://github.com/xus-code/bundle-tools/commit/30fbfc48305b5aa2c17d6decca7e08416271fed9)
- 新增rollup types [a88539](https://github.com/xus-code/bundle-tools/commit/a88539825976b37221740c291ad0c29e1d9be0cb)
- 载入配置文件的plugin和preset [079869](https://github.com/xus-code/bundle-tools/commit/0798694a43e7d3caf8564c6c8839dac6ad4401f2)
- 增加 react demo [ca10be](https://github.com/xus-code/bundle-tools/commit/ca10be3ea5c516f7dc991b3035c46a57002d8afb)
- 增加 sass 示例 [044c30](https://github.com/xus-code/bundle-tools/commit/044c3055a80170a47ae6e3930ecdfc6a78bba901)
- 增加asset demo [5691a9](https://github.com/xus-code/bundle-tools/commit/5691a96beb12665e746a9895ebb329f7446bb4e7)
- 增加copy指令 [1840a2](https://github.com/xus-code/bundle-tools/commit/1840a2f15002336609758c0db11d93c0d10dfe11)
- 增加js demo [d56705](https://github.com/xus-code/bundle-tools/commit/d5670582ee9e37120009f3a64cfe32b4c405f462)
- 增加ts demo [d0a517](https://github.com/xus-code/bundle-tools/commit/d0a517a646b51afb24048998fdfbf01b1c80516f)
- build lib 初步完成 [3394e5](https://github.com/xus-code/bundle-tools/commit/3394e5097065c553e488b8d4fbd1f151d03482dd)
- commitlint增加release支持 [9d72b8](https://github.com/xus-code/bundle-tools/commit/9d72b802d9a5a43641823a66206d3d5ebb3a1b6e)
- help指令开发 [488a15](https://github.com/xus-code/bundle-tools/commit/488a15acee677fef7afa9a2b097636777504efa7)
- legacy打包降级插件 [71ea0a](https://github.com/xus-code/bundle-tools/commit/71ea0ab566abc579de64e552cf1299c3b7547d14)
- release增加指定包能力 [a42c9a](https://github.com/xus-code/bundle-tools/commit/a42c9a765883daf9f95813c719a2367fcb43083f)
- rollup bundler to bundle js [be3f40](https://github.com/xus-code/bundle-tools/commit/be3f4036977cdbf6fbda003bd554dbc9d48d844b)
- rollup-chain环境变量 [518bbe](https://github.com/xus-code/bundle-tools/commit/518bbef8c5669e9859d17d88af6351f50c12ba26)
- vuejsx打包插件 [aa9d7b](https://github.com/xus-code/bundle-tools/commit/aa9d7b6146b35b6da948fed2da126cbd96d2534e)
- bundler-rollup: bundler-rollup 插件开发完成 [7ead3a](https://github.com/xus-code/bundle-tools/commit/7ead3a7d46a9e7962dee78c39b50e6889442c4e2)
- cmd: 新增clean指令 [adc678](https://github.com/xus-code/bundle-tools/commit/adc6788359fa0d1b1b15e77002201e1837416f27)
- commit-lint: 添加commit-lint插件 [4832cb](https://github.com/xus-code/bundle-tools/commit/4832cb3e7a0e8e57ed5898db6ad8d250d144d5c9)
- compiler: 新增js-compiler [5932f7](https://github.com/xus-code/bundle-tools/commit/5932f7768b2464432f5a9fb2cf901877651eb4aa)
- compiler: add js/react compiler [452b20](https://github.com/xus-code/bundle-tools/commit/452b20674b7edbd411ecdd97068a69c5e56151be)
- rollup: init format [ac2c01](https://github.com/xus-code/bundle-tools/commit/ac2c01b543ab7b9c205224a73c772430f14334d9)
- shared: 新增文件相关工具函数 [0a62ab](https://github.com/xus-code/bundle-tools/commit/0a62abe423ad417696555e63c264caac93d78345)

**init**

- 初始化项目 [f7a678](https://github.com/xus-code/bundle-tools/commit/f7a678d4734d367b0b5b8fc431fc13dfb7e71d14)

**optimization**

- 优化打包产出 [a69a34](https://github.com/xus-code/bundle-tools/commit/a69a346976b32accfd347d93c818b2ecafd8360c)

**refactor**

- 将基础指令整合到preset中 [65a796](https://github.com/xus-code/bundle-tools/commit/65a796b795d6fde127308a1283b82abfa9cecd56)
- 增强getfilemeta和babelregister能力 [c55eb0](https://github.com/xus-code/bundle-tools/commit/c55eb0f67e71ecae1de8fa6abc55bc71c513b390)
- 重构插件机制和包结构 [d84a29](https://github.com/xus-code/bundle-tools/commit/d84a2915cd8b601c51be6648cae5f2ee6df84d37)
- 重构配置文件 [d3dda9](https://github.com/xus-code/bundle-tools/commit/d3dda92f4c1aa8f4f72fd25728e71946a2c3c94e)
- 重构lib-build改为esbuild处理 [435bca](https://github.com/xus-code/bundle-tools/commit/435bcaddec9ed3c69c826da9a820df140669ddd7)

- 修复replace错误问题 [604cf3](https://github.com/xus-code/bundle-tools/commit/604cf3d3fe985cfd5a9f90ed058660d2e6f838fe)
- commit-lint支持gitHooks [eae1e4](https://github.com/xus-code/bundle-tools/commit/eae1e4b1cb572fc6ef8d1f04255f6775f7490997)
- Initial commit [65d707](https://github.com/xus-code/bundle-tools/commit/65d707acdb99c55974b16333be45943040988782)
### [v](https://github.com/xus-code/bundle-tools/compare/...v)

`2021-03-22`

**Bug Fixes**

- 错误执行两次write [3b4df3](https://github.com/xus-code/bundle-tools/commit/3b4df33d67bc2bcc94cfa484cb5fd945f5afc7e7)
- 导出createXusConfig [fa2aa7](https://github.com/xus-code/bundle-tools/commit/fa2aa7bc3079137c6ee5fd456e7e85d86eeb69d7)
- 调整项目结构 [b20982](https://github.com/xus-code/bundle-tools/commit/b20982401547c20e869cf57326570b7ee34f2ee8)
- 调整js处理顺序 [fa094c](https://github.com/xus-code/bundle-tools/commit/fa094cab9fb4a410d07ad298c16f39388f80d37e)
- 调整order算法 [3658c0](https://github.com/xus-code/bundle-tools/commit/3658c0edbe6cbab98d37517d821b46725457e31d)
- 发布分支分支支持可配置 [426ad0](https://github.com/xus-code/bundle-tools/commit/426ad028e83ad7f60adcd6cfcf68c646291a8e89)
- 更好的打包过程展示 [e673b0](https://github.com/xus-code/bundle-tools/commit/e673b0768e4c0e83e980bd53ed86cf73507769d2)
- 更新roll-chain版本 [4c1e5e](https://github.com/xus-code/bundle-tools/commit/4c1e5eaea5d18561e00a12b0cbb87ae3cb39155b)
- 忽略循环依赖warning [fb837e](https://github.com/xus-code/bundle-tools/commit/fb837ed0f81382c65cbddc24b6c56d2c60c81682)
- 兼容独立编译模式 [b8af74](https://github.com/xus-code/bundle-tools/commit/b8af74457b817cce1e649ff3ad6761f6410494ee)
- 将默认targets交由代码阶段赋值 [853e29](https://github.com/xus-code/bundle-tools/commit/853e29504055e702c3426d5ffe7b9cc20cc30dfc)
- 将内部方法增加$前缀 [adad67](https://github.com/xus-code/bundle-tools/commit/adad67a9f89928a1ee1ec497413d1309619c59cc)
- 去除ctx设置能力统一采用cwd [e5714e](https://github.com/xus-code/bundle-tools/commit/e5714e05ecd5c7def9954fa891c8a8e7e10a92cf)
- 深度可选config [cc01c4](https://github.com/xus-code/bundle-tools/commit/cc01c413067bad19e88baa105f1a052f45bb8d8b)
- 修复esbuildregister失效 [05a00b](https://github.com/xus-code/bundle-tools/commit/05a00b1ca5342677ff7f15a794a1754d8e32455e)
- 修复js-compiler构建问题 [13ca46](https://github.com/xus-code/bundle-tools/commit/13ca469190b0db717e5caf0690949543f94594c9)
- 修复release输出文字 [54d1c0](https://github.com/xus-code/bundle-tools/commit/54d1c0ff90cc3fdc150a4538ebf37a7d502db4dc)
- 修复release在单包模式下路径错误 [65ba8b](https://github.com/xus-code/bundle-tools/commit/65ba8b1437699502e8496d2a4c96cc6d1378be60)
- 修改create-lib状态 [518965](https://github.com/xus-code/bundle-tools/commit/51896548b091f6b53994f1160637b0ef80514f33)
- 修正快捷注册方法的类型推导 [2b776d](https://github.com/xus-code/bundle-tools/commit/2b776d16039fd21e4eeec28be9500773eeeb4cab)
- 修正类型 [7ff9fd](https://github.com/xus-code/bundle-tools/commit/7ff9fd049b7cd461b4e8e97c90e96f5a41114eff)
- 修正config类型 [bd1723](https://github.com/xus-code/bundle-tools/commit/bd1723d4ad3784521338af3fd85e784bb009c664)
- 修正help输出格式 [45d9de](https://github.com/xus-code/bundle-tools/commit/45d9decdff89034eba9a7771939cf4015c9483a2)
- 修正Hook和Plugin类型 [7fc57f](https://github.com/xus-code/bundle-tools/commit/7fc57f9e85513e8426e88cfed61659bbe24f9c43)
- 整理rollup插件的导出形式 [2618d8](https://github.com/xus-code/bundle-tools/commit/2618d8f741d40c340eeb133a04e50cc51b7b04a9)
- create-lib不再主动安装依赖 [3fb09b](https://github.com/xus-code/bundle-tools/commit/3fb09b8ba50fedec062ed6f6c516858909a14df5)
- create-lib去除和cli的耦合 [136420](https://github.com/xus-code/bundle-tools/commit/136420c6c001fb7c429209d0d3899cd506740921)
- env管理器获取env错误 [a22746](https://github.com/xus-code/bundle-tools/commit/a2274635a43bb93dfc0293f6e556a1c838e6573e)
- release没有await runCmd [3b421b](https://github.com/xus-code/bundle-tools/commit/3b421b477617f3b88bb3b1a8be9c1cf5fde27df1)
- rollup types文件后删除不必的文件和文件夹 [068c02](https://github.com/xus-code/bundle-tools/commit/068c0233861d639433de894c8316e1bcd36ee872)

**Document**

- 增加readme [cd5acd](https://github.com/xus-code/bundle-tools/commit/cd5acdcef56cef691cb90fb37ad0f0fe1e8f8441)
- readme [f50d55](https://github.com/xus-code/bundle-tools/commit/f50d554d039056a654738c2d531ccdecce22c57b)

**Feature**

- 暴露getCmdArgs供给api [76ce0b](https://github.com/xus-code/bundle-tools/commit/76ce0b8fc7a41dc8488d30b60b7879d93a052d7e)
- 导出创建rollupchain函数供配置文件语法提示 [ab2eb8](https://github.com/xus-code/bundle-tools/commit/ab2eb86d1f89704178d164fe2feab0c69b024184)
- 更换babelRegister为esbuildRegister [03a1e9](https://github.com/xus-code/bundle-tools/commit/03a1e940675d883c3bc090c07d76e486bf6b0953)
- 基于插件的cli初步实现 [4bac79](https://github.com/xus-code/bundle-tools/commit/4bac7958da8e377ee909a627e0b8d10e75b698e5)
- 生产模式下自动开启sourceMap [30eacf](https://github.com/xus-code/bundle-tools/commit/30eacf7a8926d311780d36f96103f5e28c0091bc)
- 添加create指令 [1948c7](https://github.com/xus-code/bundle-tools/commit/1948c7349a06a76230e38a18dafd1686146d51ca)
- 添加json解析插件 [08e597](https://github.com/xus-code/bundle-tools/commit/08e5971dbda0ce72123b69fbdd7f23ebf7b97a3a)
- 添加lerna模板 [b46225](https://github.com/xus-code/bundle-tools/commit/b46225fa73401d627ec8593b6ae55a7dc01072c2)
- 添加postcss插件 [10ae08](https://github.com/xus-code/bundle-tools/commit/10ae089e8ce0eeb1a053e1f34041c5a2088d4dfc)
- 添加type打包 [8e7d1b](https://github.com/xus-code/bundle-tools/commit/8e7d1bd47662ce98034a781f6a2d50070cce97a4)
- 添加vue jsx demo [bd55bd](https://github.com/xus-code/bundle-tools/commit/bd55bd6c1510c703a150e44356a6f801f20042e7)
- 添加watch模式 [66f4f4](https://github.com/xus-code/bundle-tools/commit/66f4f46d703d69c1a6fbcc266d1619d457945667)
- 新增changelog,lint,release,clean指令 [30fbfc](https://github.com/xus-code/bundle-tools/commit/30fbfc48305b5aa2c17d6decca7e08416271fed9)
- 新增rollup types [a88539](https://github.com/xus-code/bundle-tools/commit/a88539825976b37221740c291ad0c29e1d9be0cb)
- 载入配置文件的plugin和preset [079869](https://github.com/xus-code/bundle-tools/commit/0798694a43e7d3caf8564c6c8839dac6ad4401f2)
- 增加 react demo [ca10be](https://github.com/xus-code/bundle-tools/commit/ca10be3ea5c516f7dc991b3035c46a57002d8afb)
- 增加 sass 示例 [044c30](https://github.com/xus-code/bundle-tools/commit/044c3055a80170a47ae6e3930ecdfc6a78bba901)
- 增加asset demo [5691a9](https://github.com/xus-code/bundle-tools/commit/5691a96beb12665e746a9895ebb329f7446bb4e7)
- 增加copy指令 [1840a2](https://github.com/xus-code/bundle-tools/commit/1840a2f15002336609758c0db11d93c0d10dfe11)
- 增加js demo [d56705](https://github.com/xus-code/bundle-tools/commit/d5670582ee9e37120009f3a64cfe32b4c405f462)
- 增加ts demo [d0a517](https://github.com/xus-code/bundle-tools/commit/d0a517a646b51afb24048998fdfbf01b1c80516f)
- build lib 初步完成 [3394e5](https://github.com/xus-code/bundle-tools/commit/3394e5097065c553e488b8d4fbd1f151d03482dd)
- commitlint增加release支持 [9d72b8](https://github.com/xus-code/bundle-tools/commit/9d72b802d9a5a43641823a66206d3d5ebb3a1b6e)
- help指令开发 [488a15](https://github.com/xus-code/bundle-tools/commit/488a15acee677fef7afa9a2b097636777504efa7)
- legacy打包降级插件 [71ea0a](https://github.com/xus-code/bundle-tools/commit/71ea0ab566abc579de64e552cf1299c3b7547d14)
- release增加指定包能力 [a42c9a](https://github.com/xus-code/bundle-tools/commit/a42c9a765883daf9f95813c719a2367fcb43083f)
- rollup bundler to bundle js [be3f40](https://github.com/xus-code/bundle-tools/commit/be3f4036977cdbf6fbda003bd554dbc9d48d844b)
- rollup-chain环境变量 [518bbe](https://github.com/xus-code/bundle-tools/commit/518bbef8c5669e9859d17d88af6351f50c12ba26)
- vuejsx打包插件 [aa9d7b](https://github.com/xus-code/bundle-tools/commit/aa9d7b6146b35b6da948fed2da126cbd96d2534e)
- bundler-rollup: bundler-rollup 插件开发完成 [7ead3a](https://github.com/xus-code/bundle-tools/commit/7ead3a7d46a9e7962dee78c39b50e6889442c4e2)
- cmd: 新增clean指令 [adc678](https://github.com/xus-code/bundle-tools/commit/adc6788359fa0d1b1b15e77002201e1837416f27)
- commit-lint: 添加commit-lint插件 [4832cb](https://github.com/xus-code/bundle-tools/commit/4832cb3e7a0e8e57ed5898db6ad8d250d144d5c9)
- compiler: 新增js-compiler [5932f7](https://github.com/xus-code/bundle-tools/commit/5932f7768b2464432f5a9fb2cf901877651eb4aa)
- compiler: add js/react compiler [452b20](https://github.com/xus-code/bundle-tools/commit/452b20674b7edbd411ecdd97068a69c5e56151be)
- rollup: init format [ac2c01](https://github.com/xus-code/bundle-tools/commit/ac2c01b543ab7b9c205224a73c772430f14334d9)
- shared: 新增文件相关工具函数 [0a62ab](https://github.com/xus-code/bundle-tools/commit/0a62abe423ad417696555e63c264caac93d78345)

**init**

- 初始化项目 [f7a678](https://github.com/xus-code/bundle-tools/commit/f7a678d4734d367b0b5b8fc431fc13dfb7e71d14)

**optimization**

- 优化打包产出 [a69a34](https://github.com/xus-code/bundle-tools/commit/a69a346976b32accfd347d93c818b2ecafd8360c)

**refactor**

- 将基础指令整合到preset中 [65a796](https://github.com/xus-code/bundle-tools/commit/65a796b795d6fde127308a1283b82abfa9cecd56)
- 增强getfilemeta和babelregister能力 [c55eb0](https://github.com/xus-code/bundle-tools/commit/c55eb0f67e71ecae1de8fa6abc55bc71c513b390)
- 重构插件机制和包结构 [d84a29](https://github.com/xus-code/bundle-tools/commit/d84a2915cd8b601c51be6648cae5f2ee6df84d37)
- 重构配置文件 [d3dda9](https://github.com/xus-code/bundle-tools/commit/d3dda92f4c1aa8f4f72fd25728e71946a2c3c94e)
- 重构lib-build改为esbuild处理 [435bca](https://github.com/xus-code/bundle-tools/commit/435bcaddec9ed3c69c826da9a820df140669ddd7)

- 修复replace错误问题 [604cf3](https://github.com/xus-code/bundle-tools/commit/604cf3d3fe985cfd5a9f90ed058660d2e6f838fe)
- commit-lint支持gitHooks [eae1e4](https://github.com/xus-code/bundle-tools/commit/eae1e4b1cb572fc6ef8d1f04255f6775f7490997)
- Initial commit [65d707](https://github.com/xus-code/bundle-tools/commit/65d707acdb99c55974b16333be45943040988782)
