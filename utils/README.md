# 设计

有一个默认的文件 global, 里面存放全局变量

- local: `#localSymbol`
- external: `@externalSymbol`

extension 里面写了一个插件:

- 保存文件的时候, 会生成相应的 json
- 删除文件的时候, 会删除相应的 json
