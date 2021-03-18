## `@xus/cli`

插件化的脚手架内核

## 特性

1. 高度插件化：所有功能基于插件实现，`@xus/core`实现了脚手架的核心生命周期，并且使所有能力都插件化

2. 跨插件的`hook`机制：基于`tapable`的`hook`调用机制，挂载于核心`service`实现跨插件的`hook`联动

3. `import from one`: 所有内容均从`@xus/cli`包导出

## 默认`lib`打包能力

默认的`preset`中包含了基于`rollup`和`esbuild`的类库打包器，自动嗅探项目环境实现`js/ts/vue/react`(支持`jsx`)打包。

采用了`esbuild`作为核心`transform`来处理代码，并且提供`legacy`满足降级到`es5`产出以及`runtime`等需求。
