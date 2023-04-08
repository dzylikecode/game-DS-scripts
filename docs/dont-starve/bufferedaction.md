# bufferedaction.lua

self

- require "class"
- require "actions"

action 和一些系列 action buffer 组合的整体

## BufferedAction

<docs-expose>

BufferedAction = doer, target, action : @Action, invobject, pos, recipe, options, distance

- doer
- target
- action
- invobject: invoked object
- pos
- recipe
- options
- distance

</docs-expose>

额外的属性

- initialtargetowner
- onsuccess: 成功时, 待执行的 action buffer
- onfail: 失败时, 待执行的 action buffer
- options

## BufferedAction-Do

<docs-expose>

() => success: Boolean, reason

</docs-expose>

1. 执行动作
2. 作用于 invoked object
3. 执行 action buffer

## BufferedAction-TestForStart

<docs-expose>

() => success: Boolean, reason

</docs-expose>

## BufferedAction-IsValid

## BufferedAction-GetActionString

## BufferedAction-\_\_tostring

## BufferedAction-AddFailAction

<docs-expose>

添加 action buffer

</docs-expose>

## BufferedAction-AddSuccessAction

<docs-expose>

添加 action buffer

</docs-expose>

## BufferedAction-Succeed

<docs-expose>

执行动作序列

</docs-expose>

## BufferedAction-Fail

<docs-expose>

执行动作序列

</docs-expose>
