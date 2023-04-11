# behaviourtree.lua

- require "class"

将 behaviour 用 tree 方式来描述

## BT

<docs-expose>

BT = inst, root

behaviour tree

</docs-expose>

## BT-ForceUpdate

<docs-expose>

() => ()

</docs-expose>

## BT-Update

<docs-expose>

() => ()

forceupdate will set false

</docs-expose>

1. root visit
2. root save status
3. root step

## BT-Reset

## BT-Stop

## BT-GetSleepTime

## BehaviourNode

<docs-expose>

BehaviourNode = name: string, children: [ @BehaviourNode ]

BehaviourNode:

- name
- children
- status: @Enum, 即 @global-status
- lastresult: @Enum 与 status 形同
- parent: @BehaviourNode

</docs-expose>

## BehaviourNode-DoToParents

<docs-expose>

fn => ()

- fn: node: @BehaviourNode => ()

对所有的 parents 执行 fn

</docs-expose>

## BehaviourNode-Sleep

<docs-expose>

t => ()

实际上是修改更新的时间 nextupdatetime

</docs-expose>

## BehaviourNode-GetSleepTime

<docs-expose>

() => ()

running 状态, 无子节点, 不是 @ConditionNode 才有 sleep time

</docs-expose>

就是用 nextupdatetime - GetTime()

## BehaviourNode-GetTreeSleepTime

<docs-expose>

() => ()

实际上就是计算最底层所有子节点中最大的 sleep time

</docs-expose>

## BehaviourNode-Visit

<docs-expose>

() => ()

将当前节点 status 设为 FAILED

</docs-expose>

## BehaviourNode-SaveStatus

<docs-expose>

() => ()

将自己和所有子节点的状态保留进入 lastresult

</docs-expose>

## BehaviourNode-Step

<docs-expose>

() => ()

</docs-expose>

## BehaviourNode-Reset

<docs-expose>

将当前节点和所有子节点设置为 READY

</docs-expose>

## local

### profilewrapvisit

<docs-expose>

node: @BehaviourNode => ()

decorate 所有 node 的 @BehaviourNode-Visit

</docs-expose>

被 TheSim (类似于 stack) push 名字

### global-status

<docs-expose>

```lua
SUCCESS = "SUCCESS"
FAILED = "FAILED"
READY = "READY"
RUNNING = "RUNNING"
```

全局变量

</docs-expose>

## References

1. [BehaviourTree: 从饥荒的 Lua 脚本中抽离出的 Lua 行为树。将行为树修改为不依赖于他原本的 Class 文件，转而依赖于 Cocos2dx-lua 中的 functions 文件](https://gitee.com/anxin1225/BehaviourTree)
2. [第五期 思想 - 让生物拥有智慧 - 知乎](https://zhuanlan.zhihu.com/p/460999291)
3. Behavior tree (artificial intelligence, robotics and control). (2023, January 21). In Wikipedia. https://en.wikipedia.org/wiki/Behavior_tree_(artificial_intelligence,_robotics_and_control)
4. [Behavior tree - Wikipedia](https://en.wikipedia.org/wiki/Behavior_tree)
