# quick start

## file system

饥荒 Mod 采用了隔离良好的设计，每个 Mod 拥有自己的运行环境，独立于游戏主环境和其它 Mod 的运行环境。而且单个 Mod 的文件结构，和游戏本身的文件结构极其相似 [^mod file sys] :

- `modinfo.lua`
- `modmain.lua`
- `modworldgenmain.lua`
- `scripts`
  - `prefabs`
  - `components`
  - `widgets`
  - `stategraphs`
  - `brains`: 存放自定义生物 AI 文件
  - `map`
- anim
- images
- bigportrits：存放人物立绘
- sounds
- exported  
  存放未编译的 Spriter 项目，安装有 Mod Tools 时，会自动编译各个 Spriter 项目，打包存放至 anim 文件夹下

## struct

## References

1. [LongFei gamer 饥荒 mods 哔哩哔哩 bilibili](https://space.bilibili.com/19721091/channel/collectiondetail?sid=326445&ctype=0)
2. [饥荒联机版 Mod 开发——配置代码环境（二）*饥荒 mod 开发文档*夏湾的博客-CSDN 博客](https://blog.csdn.net/weixin_46068322/article/details/126087533?spm=1001.2014.3001.5502)
3. [-mod file sys] [第三章 基本框架 - 简书](https://www.jianshu.com/p/a9aa208eeee5)
4. [Don'tStarve Mod 编程综述 - 简书](https://www.jianshu.com/p/d7fe2d2117cd)
5. [create mods for Don't Starve Together](https://youtu.be/hkyxbU_OgeU)
