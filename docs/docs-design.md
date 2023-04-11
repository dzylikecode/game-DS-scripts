# docs

## 引用设计

一开始:

- `@`用来全局索引, @前面要有空格, 结尾空格或者,
- `#`用来局部索引, #前面要有空格, 结尾空格或者,

发现这样并不统一, 决定统一使用 `@`

## md 设计

markdown 编写设计

```txt
# abigailbrain.lua                      <--- 添加 .lua 是为了防止标题和其他二级标题名字相同而冲突

- require "Class"                       <--- 引用的文件
- require "behaviours/follow"
- pig = require "prefabs/pig"           <--- "prefabs/pig" 返回的对象会重命名为 pig
- return AbigailBrain                   <--- 返回出去的对象, 可省略

## echo                                 <--- 暴露的接口

关于@echo                               <--- 引用暴露的接口, 其中空格和逗号表示结束整个名字

@BT-fn 是                               <--- 引用 BT-fn

对于@pig-eat 是                         <--- 引用 pig-eat

<docs-expose>                           <--- 标记暴露的接口, 用来生成文档的 cache

interface 接口之类的

</docs-expose>                          <--- 结束标记


## AbigailBrain-OnStart                 <--- 用-代替符号 .或者:

## AbigailBrain                         <--- 特别的, AbigailBrain被return, 虽然是local, 此时应该是 external

## local                                <--- 局部变量定义在这里, 其下的三级标题都是局部变量

### \_\_index                           <--- 下划线 _ 前面需要 \ 来转义

### \_\_newindex

## References                           <--- 写参考文献的地方, 不会被导出
```

## json 设计

json 作为 markdown 的 cache 文件

```js
const luaMoudle = {
  id: "brain/abigailbrain",
  as: { pig: "prefabs/pig" },
  deps: ["Class", "behaviours/follow"],
  ret: "AbigailBrain",
  extern: [
    { id: "echo", info: "docs-expose里面的内容" },
    { id: "AbigailBrain-OnStart", info: "docs-expose里面的内容" },
    { id: "AbigailBrain", info: "docs-expose里面的内容" },
  ],
  local: [
    { id: "__index", info: "docs-expose里面的内容" },
    { id: "__newindex", info: "docs-expose里面的内容" },
  ],
};
```

?> 都会依赖一个全局模块`GLOBAL`, 但是不用放到 deps, 而是在 parse 过程中体现

- as 里面也是 deps 部分

简写名字, 压缩 json 内容

- name -> id
- dependencies -> deps
- external -> extern
- description -> info
- return -> ret, 防止和 js 的 return 冲突

## parse 过程

1. docsify 加载一个 markdown 会加载相应的 cache, 连同所依赖的 cache(不递归), GLOBAL 常驻
2. 当 hover 于 `@` 对象:
   1. 先在当前对于的 cache 的 local 里面找, 然后到 external 里面找
   2. 然后到 deps 里面找

deps 找:

1. 是否和 as 匹配
2. 接着在 deps 里面找
