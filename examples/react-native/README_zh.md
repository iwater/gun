# Gun on react-native!
---
### 运行演示
1. 在演示目录 `examples/react-native` 上执行 `yarn install`
2. 使用 `react-native run-ios` 或 `react-native run-android` 运行演示

### 调试
我建议使用 [react-native-debugger](https://github.com/facebook/react-devtools/tree/master/packages/react-devtools)，但您也可以使用 Chrome 的调试器

- ios: `cmd+D` 然后 `Debug JS Remotely`
- android: `cmd+M` 然后 `Debug JS Remotely`

现在您可以在控制台中访问 gun 全局变量，它们是
`gun` -> 根 gun 实例
`user` -> gun 用户
---
#这一切是如何完成的
由于 react-native 没有提供我们最想要的 crypto 模块，并且所有软件包都与 react-native/sea 不兼容，因此为了让 `sea.js` 工作，我们使用 webview（react-native 浏览器）并将 crypto 模块从该浏览器桥接到全局 `window`，这正是 `webview-crypto` 所做的，感谢 [webview-crypto 仓库](https://github.com/saulshanabrook/webview-crypto)，本仓库中提供的 webview-crypto 有些相同，但经过修改以使其正常工作并且主要与 sea/react-native 兼容（即使有相应的 polyfiller，但它就是不起作用 ;/）。
