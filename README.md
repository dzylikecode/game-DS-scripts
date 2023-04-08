# don't starve API docs

## 约定

- `@`用来全局索引, @前面要有空格, 结尾空格或者,
- `#`用来局部索引, #前面要有空格, 结尾空格或者,

languages 下面放 `*.po` 的翻译文件

## expose

类型先写, 参考了一些类型注释 [^type js] [^type hs]

- class, array 等对象:

  className = constructorVar1 : type1, constructorVar2 : type2

- function:

  var1 : type1, var2 : type2 => return1 : type1, return2 : type2

  `=>` 右结合

## References

1. [-type js] [Use JSDoc: Index](https://jsdoc.app/)
2. [-type hs] Haskell
