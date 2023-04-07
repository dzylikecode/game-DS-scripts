# in.lua

## makereadonly

它的实现挺有意思的

---

expose:

- table
- key

使得 key 变为只读

---

## addsetter

## Class

---

expose:

- base: Function/Table
- ctor
- props

---

## local

### \_\_index

---

expose:

- table
- key

为兼容 lua 5.1, 类似于 js 的 getter

---

### \_\_newindex

---

expose:

- table
- key
- value

为兼容 lua 5.1, 类似于 js 的 setter

---
