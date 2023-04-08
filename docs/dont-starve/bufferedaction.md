# bufferedaction.lua

- require "class"

## BufferedAction

<docs-expose>

constructor:

- doer
- target
- action
- invobject
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

## BufferedAction-IsValid

## BufferedAction-AddFailAction

## BufferedAction-AddSuccessAction

## BufferedAction-Succeed

<docs-expose>

执行动作序列

</docs-expose>

## BufferedAction-Fail

<docs-expose>

执行动作序列

</docs-expose>
