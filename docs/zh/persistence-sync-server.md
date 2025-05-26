# GUN 持久化与 syncServer 外部数据存储指南

## 1. GUN 持久化简介

GUN 是一个去中心化的图数据库，虽然它可以在内存中运行或利用浏览器本地存储，但对于生产环境中的 `syncServer`（同步服务器）而言，将数据持久化到可靠的外部数据存储中至关重要。GUN 提供了灵活的机制来实现这一点，允许开发者将数据存储到诸如 MySQL、Redis、PostgreSQL 或其他类型的数据库中。

## 2. 存储适配器 API (Storage Adapter API)

GUN 通过其存储适配器 API 与底层存储系统进行交互。任何想要为 GUN 提供持久化能力的模块都需要实现这个 API。该 API 包含三个核心方法：

*   `put(filename, data, cb)`:
    *   **功能**: 将数据 (`data`) 写入到指定的 `filename`。在 GUN 的上下文中，`filename` 通常代表一个节点或图数据块的标识符。
    *   **参数**:
        *   `filename` (String): 数据的唯一标识符或文件名。
        *   `data` (String/Object): 要存储的数据。通常是序列化后的 JSON 字符串。
        *   `cb` (Function): 操作完成后的回调函数，通常接收一个错误对象作为参数 (e.g., `cb(err)`)。
*   `get(filename, cb)`:
    *   **功能**: 从指定的 `filename` 读取数据。
    *   **参数**:
        *   `filename` (String): 数据的唯一标识符或文件名。
        *   `cb` (Function): 操作完成后的回调函数，接收两个参数：错误对象和读取到的数据 (e.g., `cb(err, data)`)。如果文件不存在，通常返回 `null` 或 `undefined` 作为数据，且不报错。
*   `list(cb)`:
    *   **功能**: 列出存储中的所有 `filename`。这个方法对于 GUN 初始化时加载现有数据或进行某些内部操作可能很重要。
    *   **参数**:
        *   `cb` (Function): 操作完成后的回调函数，接收两个参数：错误对象和一个包含所有文件名（字符串）的数组或流 (e.g., `cb(err, filenames)`)。

## 3. 使用自定义存储适配器

要将 GUN 与 MySQL、Redis 或其他非默认存储后端集成，你需要一个自定义的存储适配器。

*   **实现适配器**:
    *   自定义适配器是一个 JavaScript 模块，它实现了上述的 `put`、`get` 和 `list` 方法。
    *   该模块会将这些通用的文件操作调用转换为特定数据库的操作。例如：
        *   对于 **MySQL**:
            *   `put(filename, data, cb)` 可能会转换为 `INSERT INTO gun_data (id, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?`。
            *   `get(filename, cb)` 可能会转换为 `SELECT value FROM gun_data WHERE id = ?`。
            *   `list(cb)` 可能会转换为 `SELECT id FROM gun_data`。
        *   对于 **Redis**:
            *   `put(filename, data, cb)` 可能会转换为 `SET gun:filename data`。
            *   `get(filename, cb)` 可能会转换为 `GET gun:filename`。
            *   `list(cb)` 可能会使用 `SCAN` 或 `KEYS gun:*` (生产环境中需谨慎使用 `KEYS`)。
*   **社区适配器**:
    *   在 GUN 社区中，可能已经存在针对某些流行数据库的适配器（例如 `gun-level`, `gun-mongo`）。在着手编写自己的适配器之前，可以先搜索一下是否有可用的模块。但理解其工作原理对于定制和排错仍然很重要。

## 4. 配置 GUN 使用自定义存储

当你拥有一个存储适配器后，需要在 GUN 的构造函数中指定它，并且**非常重要**的是要禁用 GUN 默认的基于文件的持久化系统 Radisk。

```javascript
// 引入你的自定义适配器
// 假设你的适配器需要数据库连接配置
const myCustomAdapter = require('./my-database-adapter.js')({
  host: 'localhost',
  port: 5432, // 或 3306, 6379 等
  user: 'your_user',
  password: 'your_password',
  database: 'gun_storage_db'
});

const Gun = require('gun');

// 配置 GUN 实例
const gun = Gun({
  store: myCustomAdapter, // 指定你的自定义适配器
  radisk: false,          // 禁用 Radisk 文件存储
  // 其他配置...
  // web: server // 如果是 syncServer，则需要关联 HTTP 服务器
});
```

*   `store: myCustomAdapter`: 将 GUN 的存储操作委托给你的适配器。
*   `radisk: false`: 这是**关键配置**。如果不设置为 `false`，GUN 仍会尝试使用其默认的 Radisk 文件系统进行持久化，这可能会导致数据冲突或未按预期存储到外部数据库。

## 5. 建立持久化的 `syncServer`

以下是一个在 Node.js 中建立使用自定义适配器的持久化 `syncServer` 的概念性代码示例：

```javascript
// --- my-adapter.js (示例适配器，你需要替换为真实的 MySQL/Redis 适配器实现) ---
// function MyAdapter(options) {
//   // 初始化数据库连接等 (例如: new require('mysql').createConnection(options))
//   // ...
//   return {
//     put: function(filename, data, cb) {
//       // 实现将数据写入数据库的逻辑
//       // 例如: db.query('INSERT ...', [filename, data], cb);
//       console.log(`ADAPTER PUT: ${filename}`, data);
//       cb(null);
//     },
//     get: function(filename, cb) {
//       // 实现从数据库读取数据的逻辑
//       // 例如: db.query('SELECT ...', [filename], (err, results) => cb(err, results[0]));
//       console.log(`ADAPTER GET: ${filename}`);
//       // cb(null, storedData); // 假设找到了数据
//       cb(null, undefined); // 模拟未找到数据
//     },
//     list: function(cb) {
//       // 实现列出所有键的逻辑
//       // 例如: db.query('SELECT id FROM ...', (err, results) => cb(err, results.map(r => r.id)));
//       console.log('ADAPTER LIST');
//       cb(null, []);
//     }
//   };
// }
// module.exports = MyAdapter;
// --- end of my-adapter.js ---


// --- server.js ---
const Gun = require('gun');
const http = require('http');

// 假设这是你的适配器，并传入了数据库配置
// const myCustomAdapter = require('./my-adapter.js')({ /* 数据库配置对象 */ });
// 为了演示，我们使用一个简单的内存对象模拟，实际应替换为真实适配器
const MOCK_DB = {};
const myCustomAdapter = {
  put: (filename, data, cb) => { MOCK_DB[filename] = data; console.log(`MOCK_DB PUT: ${filename}`); cb(null); },
  get: (filename, cb) => { console.log(`MOCK_DB GET: ${filename}`); cb(null, MOCK_DB[filename]); },
  list: (cb) => { console.log(`MOCK_DB LIST`); cb(null, Object.keys(MOCK_DB)); }
};


const server = http.createServer((req, res) => {
  // GUN 会处理 /gun WebSocket 请求
  // 你也可以添加其他 HTTP 路由
  if (Gun.serve(req, res)) { return; } 
  res.writeHead(404).end('Not Found');
});

const gun = Gun({
  store: myCustomAdapter, // 使用你的自定义适配器
  radisk: false,          // 禁用 Radisk
  web: server             // 将 GUN 附加到 HTTP 服务器以处理 WebSocket 连接
});

const PORT = process.env.PORT || 8765;
server.listen(PORT, () => {
  console.log(`持久化的 Sync Server 已启动在 http://localhost:${PORT}/gun`);
});
// --- end of server.js ---
```
在这个例子中，`my-adapter.js` 需要被替换为一个真正连接到 MySQL、Redis 或其他数据库并实现 `put/get/list` 方法的模块。

## 6. 新节点的数据同步

当一个新的 GUN 客户端节点（例如浏览器中的 GUN 实例）连接到这个配置了持久化适配器的 `syncServer` 时：
*   客户端会像连接到任何其他 GUN 对等节点一样连接到 `syncServer`。
*   当客户端请求数据（例如 `gun.get('somekey').on(data => ...)`），如果 `syncServer` 的内存中没有这份数据，它会通过存储适配器的 `get` 方法查询外部数据库。
*   当客户端写入数据（例如 `gun.get('somekey').put({hello: 'world'})`），`syncServer` 会通过存储适配器的 `put` 方法将数据写入外部数据库。
*   GUN 的内置同步协议会处理数据在客户端和服务器之间以及服务器和数据库之间的流动。

## 7. 服务器重启后的数据恢复

数据持久化和服务器重启后的恢复能力直接依赖于：
*   **外部数据库的持久性**: 你选择的数据库（MySQL, Redis 配置为持久模式等）必须能够安全地存储数据并在重启后保持可用。
*   **适配器的正确实现**:
    *   `put` 必须确保数据被正确写入数据库。
    *   `get` 必须能够在服务器启动或按需加载时从数据库中正确检索数据。
    *   `list` (如果被 GUN 内部用于初始化或某些同步场景) 应该能正确返回所有相关键。

当 `syncServer` 重启时，GUN 实例会重新创建。如果它需要访问之前持久化的数据，它会通过适配器向数据库发出 `get` 请求。只要数据库是持久的并且适配器工作正常，数据就能被恢复到 GUN 的内存图中，并同步给连接的客户端。

## 8. 多 `syncServer` 实例的一致性

在需要水平扩展 `syncServer` 的场景下，可以运行多个 `syncServer` 实例。要使这些实例保持数据一致性：

*   **共享同一个外部数据库实例**: 所有 `syncServer` 实例的 GUN 配置都必须指向**同一个共享的外部数据库**（例如，一个 MySQL 集群、一个 Redis 集群或单个高可用的数据库服务器）。
*   **GUN 的冲突解决**: 当不同的客户端通过不同的 `syncServer` 实例写入数据时，这些数据最终都会通过各自的适配器写入到共享数据库中。
    *   如果发生并发写入相同记录的情况，数据库层面可能会有自己的并发控制。
    *   更重要的是，当数据从数据库读回并分发到其他 `syncServer` 实例或客户端时，GUN 内置的冲突解决算法（CRDTs，基于时间戳或状态值的“最后写入者胜出”以及词法排序）会确保所有节点最终收敛到相同的状态。
*   **适配器的原子性 (可选但推荐)**: 虽然 GUN 的冲突解决机制可以在应用层面处理大部分一致性问题，但在适配器层面，如果数据库支持，尽可能使用原子操作（如 `INSERT ... ON DUPLICATE KEY UPDATE` 或 Redis 的原子命令）可以进一步增强健壮性，减少数据竞争的窗口期。

通过这种方式，共享数据库充当了多个 `syncServer` 实例之间的共同真理来源，而 GUN 负责处理网络层面的数据同步和冲突解决，确保整个系统的最终一致性。

## 9. 总结

通过实现自定义存储适配器 API，GUN 可以与各种外部数据库集成，从而为 `syncServer` 提供强大的持久化能力。正确配置 GUN 实例以使用该适配器并禁用 Radisk 是关键步骤。这种架构不仅支持单个持久化服务器，还能通过共享数据库实现多个 `syncServer` 实例之间的数据一致性。
