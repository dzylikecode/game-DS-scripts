# actions.lua

- require "class"
- require "bufferedaction"

## Action

<docs-expose>

Action = data, priority, instant, rmb, distance

- data: 用于扩展的数据
- priority
- instant
- rmb
- distance

Action:

- priority
- fn: #fn
- strfn
- testfn
- instant
- rmb
- distance
- mount_enabled

</docs-expose>

mount_enabled 就是通过 data 来初始化的

```lua
self.mount_enabled = data.mount_enabled or false
```

## ACTIONS

<docs-expose>

一系列的动作挂载在上面的 table

</docs-expose>

## ACTIONS-EAT-fn

<docs-expose>

执行 eat 的动作

</docs-expose>

可以作用对象挂载在 target 或者 invobject 上面

## local

### fn

<docs-expose>

act => any

- any: component 的返回值

动作的执行时通过 component 来操作的

</docs-expose>

### strfn

<docs-expose>

动作的描述

</docs-expose>
