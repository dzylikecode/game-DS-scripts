# class.lua

- require "folder/file"
- require "next/folder/file"

从 #\_\_index , #\_\_newindex , 和 @makereadonly 可以看出 class 的 instance 实现方式为:

```js
const obj = {
  _: {
    key1: [value1, setter1],
    key2: [value2, setter2],
  },
  __index: getter,
  __newindex: setter,
};
```

## makereadonly

将 setter 设置为 #onreadonly

<docs-expose>

- table
- key

使得 key 变为只读

</docs-expose>

## addsetter

<docs-expose>

- table
- key
- fn: 即为 setter

使得 key 变为只读

</docs-expose>

## removesetter

## Class

从这些角度考虑:

- instance
- class
- constructor
- base

<docs-expose>

- base
  - function: 说明是 constructor, 此时.\_ctor = base, .\_base = nil
  - table: 此时才为基类, .\_base 指向 base, base 所有的值会浅拷贝到 class
- \_ctor: function, constructor
- props: 类的属性
- return: class

class:

- (self, ...): 构造函数
- .is_a(self, klass): 是否是某个 klass
- .\_ctor: constructor
- .\_base: base class

</docs-expose>

- class -> mt, mt 里面只是存放了一个\_\_call 方法
- obj -> class

---

.(self, ...):

1. 把 props 的键值对 , 放入到 obj 中

   ```js
   {
     _: {
       key1: [nil, value1],
       key2: [nil, value2],
     },
   }
   ```

2. obj -> class
3. 调用 class.\_ctor(obj, ...), 即内部的 self = obj

---

.is_a 就是递归地找继承链

1. 获取类, 即 obj 的 metatable
2. 类通过 \_base 链接起来, 递归遍历

## ClassRegistry

<docs-expose>

expose:

- type: array

通过 @Class 生成的, 都会在这个数组里面

</docs-expose>

## local

### \_\_index

先读取当前 table 是否有属性, 没有就到 metatable 中找

<docs-expose>

- table
- key

类似于 js 的 getter

</docs-expose>

### \_\_newindex

写入的时候, 只与当前 table 有关, 则写入当前的 class, 如果存在, 则写入 value 当中,并且调用 setter

<docs-expose>

- table
- key
- value

类似于 js 的 setter, 与 [Writing doesn’t use prototype](https://javascript.info/prototype-inheritance#writing-doesn-t-use-prototype)设计一致

</docs-expose>

### onreadonly

<docs-expose>

实际上就是一个 setter

</docs-expose>
