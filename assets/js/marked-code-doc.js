(function () {
  const markedPlugins = window.gMarkedPlugins;

  const extension = {
    name: "code-doc",
    level: "inline",
    start(src) {
      let index = src.match(/[@#]/)?.index;
      return index;
    },
    tokenizer(src, tokens) {
      const externalRule = /^@([^\s]+)/;
      const localRule = /^#(([^\s]+)+)/;
      let match;
      if ((match = externalRule.exec(src))) {
        return {
          type: "code-doc",
          raw: match[0],
          text: match[1].replace(/\\/g, ""),
          linkType: "external",
        };
      } else if ((match = localRule.exec(src))) {
        return {
          type: "code-doc",
          raw: match[0],
          text: match[1].replace(/\\/g, ""),
          linkType: "local",
        };
      }
    },
    renderer(token) {
      if (token.linkType == "external") {
        return `<span class="pop-up external" data-name="${token.text}" data-level="external">${token.text}</span>`;
      } else if (token.linkType == "local") {
        return `<span class="pop-up local" data-name="${token.text}" data-level="local">${token.text}</span>`;
      }
    },
  };

  markedPlugins.push(extension);
  return;
})();

(function () {
  const docsifyPlugins = window.gDocsifyPlugins;
  const pageLink = window.gPageLink;
  const blobLink = window.gBlobLink;
  // 引用 window.gMarked, 开始的时候是 null

  let cacheFiles = {};
  let curVPath = "";
  let isLoaded = false;

  class Container {
    constructor() {
      this.container = document.createElement("div");
      this.container.classList.add("pop-up-container");
      this.body = document.querySelector("body");
      const onMouseOut = (e) => {
        // mouse out 不是进入自己, 则隐藏
        if (!this.container.contains(e.relatedTarget)) {
          this.hide();
        }
      };
      this.container.addEventListener("mouseout", onMouseOut);
    }

    setContent(content) {
      this.container.innerHTML = content;
    }

    show() {
      this.body.appendChild(this.container);
    }

    hide() {
      this.container.remove();
    }
    /**
     *
     *
     * @param {HTMLElement} elem
     */
    setMouseOver(elem) {
      const onMouseOver = (e) => {
        const { left: elemLeft, top: elemTop } = elem.getBoundingClientRect();
        const description = getContent(elem);
        this.setContent(description);
        // 需要先显示才能计算出 Client Rect
        this.show();
        const { height: containerHeight } =
          this.container.getBoundingClientRect();
        // 显示在下面
        // this.container.style.top = `${elem.offsetTop + elem.offsetHeight}px`;
        this.container.style.left = `${elemLeft}px`;
        // 显示在上面
        this.container.style.top = `${elemTop - containerHeight}px`;
      };
      elem.addEventListener("mouseover", onMouseOver);

      function getContent(elem) {
        if (!isLoaded) return "Loading...<br> Try again";
        const name = elem.dataset.name;
        const level = elem.dataset.level;
        let content = "";
        let location = "";
        if (level === "local") {
          const vals = cacheFiles[curVPath].local;
          const matchVal = vals.find((val) => val.name == name);
          if (matchVal) {
            location = matchVal.location;
            content = matchVal.description;
          }
        } else if (level === "external") {
          for (const cacheFile of Object.values(cacheFiles)) {
            const vals = cacheFile.external;
            const matchVal = vals.find((val) => val.name == name);
            if (matchVal) {
              location = matchVal.location;
              content = matchVal.description;
              break;
            }
          }
        }

        return window.gMarked.parse(
          `${name}: ${getLocation(location, name)}<br>${content}`
        );
      }

      function getLocation(location, name) {
        const docsHref = `#/docs${location}#${name.toLowerCase()}`;
        const blobPath = `${blobLink}code${location}.lua`;
        const title = location.split("/").slice(2).join("/");
        return `<a class="docs" href="${docsHref}">${title}</a> <a class="code" href="${blobPath}" target="_blank">code</a>`;
      }
    }

    setMouseOut(elem) {
      const onMouseOut = (e) => {
        // 如果进入的不是 container, 则隐藏
        if (!this.container.contains(e.relatedTarget)) {
          this.hide();
        }
      };
      elem.addEventListener("mouseout", onMouseOut);
    }

    attachTo(element) {
      this.setMouseOver(element);
      this.setMouseOut(element);
    }
  }

  function plugin(hook, vm) {
    let container = null;
    const dependencyRule = /- require\s"(.+)"/g;
    hook.beforeEach(function (html) {
      const fileRoute = vm.route.file;
      isLoaded = false;
      curVPath = fileRoute.slice(4, -3);
      const prefix = `#/docs/${curVPath.split("/")[1]}/`;
      fetchCache(curVPath);
      const viewCode = `[:rocket: VIEW CODE](${blobLink}code${curVPath}.lua)`;
      return (
        viewCode +
        html.replace(dependencyRule, (match, p1) => {
          const link = `${prefix}${p1}`;
          return `- require <a href="${link}">"${p1}"</a>`;
        })
      );
      function getCachePath(vPath) {
        const cacheDir = "assets/cache";
        return `${pageLink}${cacheDir}${vPath}.json`;
      }

      async function fetchCache(vPath) {
        const cachePath = getCachePath(vPath);
        const res = await fetch(cachePath);
        if (!res.ok) return;
        const cacheFile = JSON.parse(await res.text());
        cacheFiles[vPath] = cacheFile;
        const vDepsPathes = cacheFile.dependencies.slice(0, -1);
        for (const vDepPath of vDepsPathes) {
          // await fetchCache(vDepPath); // 这样会把所有的都包括进来
          const depCacheFile = getCachePath(vDepPath);
          const res = await fetch(depCacheFile);
          if (!res.ok) continue;
          const depCacheFileObj = JSON.parse(await res.text());
          cacheFiles[vDepPath] = depCacheFileObj;
        }
        isLoaded = true;
      }
    });
    hook.doneEach(function () {
      if (!container) container = new Container();
      const popUps = document.querySelectorAll(".pop-up");
      popUps.forEach(container.attachTo.bind(container));
    });
  }

  function install() {
    docsifyPlugins.push(plugin);
  }

  install();
})();
