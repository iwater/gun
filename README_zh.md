<p id="readme"><a href="https://gun.eco/"><img width="40%" src="https://cldup.com/TEy9yGh45l.svg"/></a><img width="50%" align="right" vspace="25" src="https://gun.eco/see/demo.gif"/></p>

[![](https://data.jsdelivr.com/v1/package/npm/gun/badge?style=rounded)](https://www.jsdelivr.com/package/npm/gun)
[![Travis](https://img.shields.io/travis/amark/gun/master.svg)](https://travis-ci.org/amark/gun)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Famark%2Fgun.svg?size=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Famark%2Fgun?ref=badge_shield)
[![Gitter](https://img.shields.io/gitter/room/amark/gun.js.svg)](https://gitter.im/amark/gun)

**GUN** 是一个工具*生态系统*，让您可以构建[社区运营](https://www.nbcnews.com/tech/tech-news/these-technologists-think-internet-broken-so-they-re-building-another-n1030136)和[加密应用程序](https://gun.eco/docs/Cartoon-Cryptography)。

目前，[Internet Archive](https://news.ycombinator.com/item?id=17685682) 和 [HackerNoon](https://www.coindesk.com/hacker-noon-is-storing-content-on-a-blockchain-after-ditching-medium) 都在生产环境中使用 GUN。

[Zoom](https://www.zdnet.com/article/era-hatches-meething-an-open-source-browser-based-video-conferencing-system/)、[Reddit](https://notabug.io/t/whatever/comments/36588a16b9008da4e3f15663c2225e949eca4a15/gpu-bot-test)、[Slack](https://iris.to/)、[YouTube](https://d.tube/)、[Wikipedia](https://news.ycombinator.com/item?id=17685682)等的去中心化替代方案已经在 GUN 上产生了数 TB 的每日 P2P 流量。我们是一个[友好的社区](http://chat.gun.eco/)，为[自由创造一个自由有趣的未来](https://youtu.be/1HJdrBk3BlE)：

<table>
<tr>
<a href="https://youtu.be/s_m16-w6bBI"><img width="31%" src="https://gun.eco/see/3dvr.gif" title="3D VR"/></a>
<a href="https://github.com/cstefanache/cstefanache.github.io/blob/master/_posts/2016-08-02-gun-db-artificial-knowledge-sharing.md#gundb"><img width="31%" src="https://gun.eco/see/aiml.gif" title="AI/ML"/></a>
<a href="http://gps.gunDB.io/"><img width="31%" src="https://gun.eco/see/gps.gif" title="GPS"/></a>
</tr>
<tr>
<a href="https://github.com/lmangani/gun-scape#gun-scape"><img width="31%" src="https://gun.eco/see/dataviz.gif" title="数据可视化"/></a>
<a href="https://github.com/amark/gun/wiki/Auth"><img width="31%" src="https://gun.eco/see/p2p.gif" title="P2P"/></a>
<a href="https://github.com/Stefdv/gun-ui-lcd#okay-what-about-gundb-"><img width="31%" src="https://gun.eco/see/iot.gif" title="物联网"/></a>
</tr>
<tr>
<a href="http://chat.gun.eco"><img width="31%" src="https://gun.eco/see/vr-world.gif" title="VR 世界"/></a>
<a href="https://youtu.be/1ASrmQ-CwX4"><img width="31%" src="https://gun.eco/see/ar.gif" title="AR"/></a>
<a href="https://meething.space/"><img width="31%" src="https://gun.eco/see/video-conf.gif" title="视频会议"/></a>
</tr>
</table>

该生态系统是一个优秀的技术栈，如下所示：（名称 -> 用例）

<div><img width="48%" src="https://gun.eco/see/stack.png"/>
<img width="48%" align="right" src="https://gun.eco/see/layers.png"/></div>

目前，最好从 GUN 开始并*仅仅使用它*来学习基础知识，因为它*非常简单**：（**或者**想阅读更多？跳到“[GUN 是什么？](#what-is-gun)”部分。）

## 快速入门

 -  尝试浏览器中的[交互式教程](https://gun.eco/docs/Todo-Dapp)（**5分钟** ~ 普通开发人员）。
 - 或者 `npm install gun` 并通过 `cd node_modules/gun && npm start` 运行示例（**5分钟** ~ 普通开发人员）。

> **注意：** 如果你没有 [node](http://nodejs.org/) 或 [npm](https://www.npmjs.com/)，请先阅读[这个](https://github.com/amark/gun/blob/master/examples/install.sh)。
> 如果 `npm` 命令行不起作用，你可能需要先 `mkdir node_modules` 或使用 `sudo`。

- 示例的在线演示可在此处获得：http://gunjs.herokuapp.com/
- 或者编写一个快速应用程序：（[立即在 jsbin 中尝试](http://jsbin.com/sovihaveso/edit?js,console)）
```html
<script src="https://cdn.jsdelivr.net/npm/gun/gun.js"></script>
<script>
// var Gun = require('gun'); // 在 NodeJS 中
// var Gun = require('gun/gun'); // 在 React 中
var gun = Gun();

gun.get('mark').put({
  name: "Mark",
  email: "mark@gunDB.io",
});

gun.get('mark').on(function(data, key){
  console.log("更新:", data);
});
</script>
```
- 或者尝试一些**令人兴奋的事情**，比如将循环引用保存到文档表中！ ([玩一下](http://jsbin.com/wefozepume/edit?js,console))
```javascript
var cat = {name: "Fluffy", species: "kitty"};
var mark = {boss: cat};
cat.slave = mark;

// 部分更新与现有数据合并！
gun.get('mark').put(mark);

// 像访问文档一样访问数据。
gun.get('mark').get('boss').get('name').once(function(data, key){
  // `val` 一次性获取数据，没有订阅。
  console.log("Mark 的老板是", data);
});

// 遍历循环引用的图！
gun.get('mark').get('boss').get('slave').once(function(data, key){
  console.log("Mark 是奴隶！", data);
});

// 将它们都添加到表中！
gun.get('list').set(gun.get('mark').get('boss'));
gun.get('list').set(gun.get('mark'));

// 从表中连续地一次性获取每个项目：
gun.get('list').map().once(function(data, key){
  console.log("项目:", data);
});

// 实时更新表格！
gun.get('list').set({type: "cucumber", goal: "scare cat"});
```

想继续构建更多吗？ **跳转到[文档](#documentation)！**

# GUN 是什么？

首先，GUN 是一个**由最友善、最乐于助人的人们组成的社区**。所以[我想邀请你](https://gitter.im/amark/gun)来告诉我们你正在从事和想要构建什么（无论是新的还是传统的！只要你也友善。）并直接向我们提问。 :)

说到这里，让我们先完成一些官方致谢：

### 支持

<p align="center">
感谢：
 
<table><tr>
<td vlign="center"><a href="https://mozilla.org/builders"><img height="100" src="https://user-images.githubusercontent.com/1423657/81992335-85346480-9643-11ea-8754-8275e98e06bc.png"></a></td>
<td vlign="center"><a href="http://unstoppabledomains.com/"><img src="https://gun.eco/img/unstoppable.png"></a></td>
</tr></table>

<a href="https://github.com/robertheessels">Robert Heessels</a>,
<a href="http://qxip.net/">Lorenzo Mangani</a>,
<a href="https://nlnet.nl/">NLnet Foundation</a>,
<a href="http://github.com/samliu">Sam Liu</a>,
<a href="http://github.com/ddombrow">Daniel Dombrowsky</a>,
<a href="http://github.com/vincentwoo">Vincent Woo</a>,
<a href="http://github.com/coolaj86">AJ ONeal</a>,
<a href="http://github.com/ottman">Bill Ottman</a>,
<a href="http://github.com/mikewlange">Mike Lange</a>,
<a href="http://github.com/ctrlplusb">Sean Matheson</a>,
<a href="http://github.com/alanmimms">Alan Mimms</a>,
<a href="https://github.com/dfreire">Dário Freire</a>,
<a href="http://github.com/velua">John Williamson</a>,
<a href="http://github.com/finwo">Robin Bron</a>,
<a href="http://github.com/ElieMakhoul">Elie Makhoul</a>,
<a href="http://github.com/mikestaub">Mike Staub</a>,
<a href="http://github.com/bmatusiak">Bradley Matusiak</a>
</p>

 - 加入其他人赞助代码：https://www.patreon.com/gunDB ！
 - 提问：http://stackoverflow.com/questions/tagged/gun ？
 - 发现错误？在此报告：https://github.com/amark/gun/issues ；
 - **需要帮助**？与我们聊天：https://gitter.im/amark/gun 。

### 历史

[GUN](https://gun.eco) 由 [Mark Nadal](https://twitter.com/marknadal) 于 2014 年创建，此前他花了 4 年时间试图让他的协作 Web 应用程序能够使用传统数据库进行扩展。

<img width="250px" src="https://gun.eco/see/problem.png" align="left" title="痛点" style="margin: 0 1em 1em 0"> 在他意识到[主从数据库架构会导致一个巨大的瓶颈](https://gun.eco/distributed/matters.html)之后，他（作为一个完全的新手局外人）天真地决定**质疑现状**并通过有争议的、异端的和逆向的实验来撼动局面：

**NoDB** - 没有主服务器，没有服务器，没有“单一事实来源”，不是用真正的编程语言或真正的硬件构建的，没有 DevOps，没有锁定，不仅仅是 SQL 或 NoSQL，而是两者兼而有之（**所有** - 图、文档、表、键/值）。

目标是构建一个 P2P 数据库，它可以在**任何**浏览器中生存，并且可以在假设**任何**离线优先活动之后正确地在**任何**设备之间同步数据。

<img src="https://gun.eco/see/compare.png" title="比较表">

从技术上讲，**GUN 是一种图形同步协议**，带有一个*轻量级嵌入式引擎*，能够在**仅约 9KB gzipped 大小**的情况下实现 *[每秒超过 2000 万次 API 操作](https://gun.eco/docs/Performance)*。

## 文档

<table>
  <tr>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/API">API 参考</a></h3></td>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/Todo-Dapp">教程</a></h3></td>
    <td style="border: 0;"><h3><a href="https://github.com/amark/gun/tree/master/examples">示例</a></h3></td>
  </tr>
  <tr>
    <td style="border: 0;"><h3><a href="https://github.com/brysgo/graphql-gun">GraphQL</a></h3></td>
    <td style="border: 0;"><h3><a href="https://github.com/PenguinMan98/electrontest">Electron</a></h3></td>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/React-Native">React & Native</a></h3></td>
  </tr>
  <tr>
    <td style="border: 0;"><h3><a href="https://github.com/sjones6/vue-gun">Vue</a></h3></td>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/Svelte">Svelte</a></h3></td>
    <td style="border: 0;"><h3><a href="https://github.com/Stefdv/gun-ui-lcd#syncing">Webcomponents</a></h3></td>
  </tr>
  <tr>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/CAP-Theorem">CAP 定理权衡</a></h3></td>
    <td style="border: 0;"><h3><a href="https://gun.eco/distributed/matters.html">数据同步如何工作</a></h3></td>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/Porting-GUN">GUN 是如何构建的</a></h3></td>
  </tr>
  <tr>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/Auth">加密认证</a></h3></td>
    <td style="border: 0;"><h3><a href="https://github.com/amark/gun/wiki/Awesome-GUN">模块</a></h3></td>
    <td style="border: 0;"><h3><a href="https://gun.eco/docs/Roadmap">路线图</a></h3></td>
  </tr>
</table>

## 深入文档

* [GUN 数据同步协议](./docs/zh/gun_sync_protocol_zh.md)

没有**社区贡献者**，这一切都是不可能的，向他们致以崇高的敬意：

**[ajmeyghani](https://github.com/ajmeyghani) ([通过图表学习 GUN 基础知识](https://medium.com/@ajmeyghani/gundb-a-graph-database-in-javascript-3860a08d873c))**； **[anywhichway](https://github.com/anywhichway) ([块存储](https://github.com/anywhichway/gun-block))**； **[beebase](https://github.com/beebase) ([Quasar](https://github.com/beebase/gun-vuex-quasar))**； **[BrockAtkinson](https://github.com/BrockAtkinson) ([brunch 配置](https://github.com/BrockAtkinson/brunch-gun))**； **[Brysgo](https://github.com/brysgo) ([GraphQL](https://github.com/brysgo/graphql-gun))**； **[d3x0r](https://github.com/d3x0r) ([SQLite](https://github.com/d3x0r/gun-db))**； **[forrestjt](https://github.com/forrestjt) ([file.js](https://github.com/amark/gun/blob/master/lib/file.js))**； **[hillct](https://github.com/hillct) (Docker)**； **[JosePedroDias](https://github.com/josepedrodias) ([图形可视化工具](http://acor.sl.pt:9966))**； **[JuniperChicago](https://github.com/JuniperChicago) ([cycle.js 绑定](https://github.com/JuniperChicago/cycle-gun))**； **[jveres](https://github.com/jveres) ([todoMVC](https://github.com/jveres/todomvc))**； **[kristianmandrup](https://github.com/kristianmandrup) ([edge](https://github.com/kristianmandrup/gun-edge))**； **[Lightnet](https://github.com/Lightnet)** ([很棒的 Vue 用户示例](https://glitch.com/edit/#!/jsvuegunui?path=README.md:1:0) 和 [用户厨房实验场](https://gdb-auth-vue-node.glitch.me/))； **[lmangani](https://github.com/lmangani) ([Cytoscape 可视化工具](https://github.com/lmangani/gun-scape)、[Cassandra](https://github.com/lmangani/gun-cassandra)、[Fastify](https://github.com/lmangani/fastify-gundb)、[LetsEncrypt](https://github.com/lmangani/polyGun-letsencrypt))**； **[mhelander](https://github.com/mhelander) ([SEA](https://github.com/amark/gun/blob/master/sea.js))**； [omarzion](https://github.com/omarzion) ([便利贴应用](https://github.com/omarzion/stickies))； [PsychoLlama](https://github.com/PsychoLlama) ([LevelDB](https://github.com/PsychoLlama/gun-level))； **[RangerMauve](https://github.com/RangerMauve) ([schema](https://github.com/gundb/gun-schema))**； **[robertheessels](https://github.com/swifty) ([gun-p2p-auth](https://github.com/swifty/gun-p2p-auth))**； **[rogowski](https://github.com/rogowski) (AXE)**； [sbeleidy](https://github.com/sbeleidy)； **[sbiaudet](https://github.com/sbiaudet) ([C# 移植](https://github.com/sbiaudet/cs-gun))**； **[Sean Matheson](https://github.com/ctrlplusb) ([Observable/RxJS/Most.js 绑定](https://github.com/ctrlplusb/gun-most))**； **[Shadyzpop](https://github.com/Shadyzpop) ([React Native 示例](https://github.com/amark/gun/tree/master/examples/react-native))**； **[sjones6](https://github.com/sjones6) ([Flint](https://github.com/sjones6/gun-flint))**； **[Stefdv](https://github.com/stefdv) (Polymer/web components)**； **[zrrrzzt](https://github.com/zrrrzzt) ([JWT 认证](https://gist.github.com/zrrrzzt/6f88dc3cedee4ee18588236756d2cfce))**； **[xmonader](https://github.com/xmonader) ([Python 移植](https://github.com/xmonader/pygundb))**；

我漏掉了很多其他人，抱歉，很快会添加他们！这份名单非常古老且严重过时，如果你想被列入其中，请提交 PR！ :)

## 测试

可以使用 `npm test` 运行测试。测试将触发对数据库的持久写入，因此后续运行测试将失败。在再次运行测试之前，必须清除数据库。这可以通过在项目目录中运行以下命令来完成。

```bash
rm -rf *data*
```

### 其他加密库

 > 这些仅适用于 NodeJS 和 React Native，它们填充了原生的浏览器 WebCrypto API。

如果你想使用 [SEA](https://gun.eco/docs/SEA) 进行用户身份验证和安全，你需要安装：

`npm install text-encoding @peculiar/webcrypto --save`

有关安装说明，请参阅[我们的 React Native 文档](https://gun.eco/docs/React-Native)！

然后你就可以毫无错误地 require [SEA](https://gun.eco/docs/SEA)了：

```javascript
var GUN = require('gun/gun');
var SEA = require('gun/sea');
```

## 部署

 > 注意：在 `npm start` 上自动部署的默认示例会将所有 GUN 文件、模块和存储 CDN 化。

要为你的开发团队快速启动一个 GUN 中继对等体，请使用 [Heroku](http://heroku.com)、[Docker](http://docker.com) 或其任何变体 [Dokku](http://dokku.viewdocs.io/dokku/)、[Flynn.io](http://flynn.io)、[now.sh](https://zeit.co/now) 等！或者全部使用它们，这样你的中继也去中心化了！

### [Heroku](https://www.heroku.com/)

[![部署](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/amark/gun)

 > Heroku 每 15 分钟删除一次数据，解决此问题的一种方法是添加[廉价存储](https://gun.eco/docs/Using-Amazon-S3-for-Storage)。

或者：

```bash
git clone https://github.com/amark/gun.git
cd gun
heroku create
git push -f heroku HEAD:master
```

然后在浏览器中访问“heroku create”步骤输出中的 URL。

### [Now.sh](https://zeit.co/now/)

```bash
npm install -g now
now --npm amark/gun
```

然后在浏览器中访问“now --npm”步骤输出中的 URL。

### [Unubo](https://unubo.app/)

Fork 这个 GUN 仓库（Unubo 仅从你自己的 GitHub 仓库部署）。
添加一个 Node.js 应用，选择你的 GUN fork，将 `npm start` 设置为启动命令并部署。

根据 [genderev](https://github.com/genderev) 的经验，这仅在将国家/地区设置为美国时才有效。

通过单击浏览器中的“查看应用”按钮访问已部署的应用。

### [Docker](https://www.docker.com/)

 > 警告：Docker 镜像是社区贡献的，可能比较旧并且缺少安全更新，请检查版本号进行比较。

[![Docker Automated buil](https://img.shields.io/docker/automated/gundb/gun.svg)](https://hub.docker.com/r/gundb/gun/) [![](https://images.microbadger.com/badges/image/gundb/gun.svg)](https://microbadger.com/images/gundb/gun "在 microbadger.com 上获取你自己的镜像徽章") [![Docker Pulls](https://img.shields.io/docker/pulls/gundb/gun.svg)](https://hub.docker.com/r/gundb/gun/) [![Docker Stars](https://img.shields.io/docker/stars/gundb/gun.svg)](https://hub.docker.com/r/gundb/gun/)

从 [Docker Hub](https://hub.docker.com/r/gundb/gun/) 拉取 [![](https://images.microbadger.com/badges/commit/gundb/gun.svg)](https://microbadger.com/images/gundb/gun)。或者：

```bash
docker run -p 8765:8765 gundb/gun
```

或者在本地构建 [Docker](https://docs.docker.com/engine/installation/) 镜像：

```bash
git clone https://github.com/amark/gun.git
cd gun
docker build -t myrepo/gundb:v1 .
docker run -p 8765:8765 myrepo/gundb:v1
```

或者，如果你希望 Docker 镜像带有元数据标签（仅限 Linux/Mac）：

```bash
npm run docker
docker run -p 8765:8765 username/gun:git
```

然后在浏览器中访问 [http://localhost:8765](http://localhost:8765)。

## 许可证

由 Mark Nadal、GUN 团队和许多了不起的贡献者 ♥ 精心设计。

根据 [Zlib / MIT / Apache 2.0](https://github.com/amark/gun/blob/master/LICENSE.md) 开放许可。

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Famark%2Fgun.svg?size=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Famark%2Fgun?ref=badge_large)

[YouTube](https://www.youtube.com/channel/UCQAtpf-zi9Pp4__2nToOM8g) . [Twitter](https://twitter.com/marknadal)
