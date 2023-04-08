# behaviourtree.lua

- require "class"

## BT

<docs-expose>

BT = inst, root

behaviour tree

</docs-expose>

## BT-ForceUpdate

<docs-expose>

() => ()

</docs-expose>

## local

### profilewrapvisit

<docs-expose>

node: @BehaviourNode => ()

decorate 所有 node 的 @BehaviourNode-Visit

</docs-expose>

被 TheSim (类似于 stack) push 名字
