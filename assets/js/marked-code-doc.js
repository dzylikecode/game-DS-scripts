(function () {
  const textExtension = {
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

  markedPlugins.push(textExtension);
  return;
})();

(function () {
  let cacheFiles = {};
  let curVPath = "";

  class Container {
    constructor() {
      this.container = document.createElement("div");
      this.container.classList.add("pop-up-container");
      this.body = document.querySelector("body");
      const onMouseOut = (e) => {
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
        this.show();
        const { height: containerHeight } =
          this.container.getBoundingClientRect();
        // this.container.style.top = `${elem.offsetTop + elem.offsetHeight}px`;
        this.container.style.left = `${elemLeft}px`;
        this.container.style.top = `${elemTop - containerHeight}px`;
      };
      elem.addEventListener("mouseover", onMouseOver);

      function getContent(elem) {
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
          Object.values(cacheFiles).forEach((cacheFile) => {
            const vals = cacheFile.external;
            const matchVal = vals.find((val) => val.name == name);
            if (matchVal) {
              location = matchVal.location;
              content = matchVal.description;
            }
          });
        }

        return marked.parse(`${name}: ${getLocation(location)}<br>${content}`);

        function getLocation(loc) {
          const href = `#/docs${loc}#${name.toLowerCase()}`;
          const title = loc.split("/").slice(2).join("/");
          return `<a href="${href}">${title}</a>`;
        }
      }
    }

    setMouseOut(elem) {
      const onMouseOut = (e) => {
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

  function main(hook, vm) {
    let container = null;
    hook.beforeEach(function (html) {
      const curFile = vm.route.file;
      curVPath = curFile.slice(4, -3);
      const cacheFile = getCachePath(curVPath);
      fetch(cacheFile)
        .then((response) => {
          if (response.ok) {
            return response;
          }
          throw new Error(`${cacheFile} not found`);
        })
        .then(async (res) => {
          cacheFiles = {};
          const cacheFileObj = JSON.parse(await res.text());
          cacheFiles[curVPath] = cacheFileObj;
          const deps = cacheFileObj.dependencies.slice(0, -1);
          // console.log(deps);
          for (const dep of deps) {
            const depCacheFile = getCachePath(dep);
            fetch(depCacheFile)
              .then((response) => {
                if (response.ok) {
                  return response;
                }
                throw new Error(`${depCacheFile} not found`);
              })
              .then(async (res) => {
                const depCacheFileObj = JSON.parse(await res.text());
                cacheFiles[dep] = depCacheFileObj;
              })
              .catch(async (err) => console.log(err));
          }
        })
        .catch(async (err) => console.log(err));
      return html;
      function getCachePath(vPath) {
        const cacheDir = "/assets/cache";
        return `${cacheDir}${vPath}.json`;
      }
    });
    hook.doneEach(function () {
      if (!container) container = new Container();
      const popUps = document.querySelectorAll(".pop-up");
      popUps.forEach(container.attachTo.bind(container));
    });
  }

  function install() {
    docsifyPlugins.push(main);
  }

  install();
})();
