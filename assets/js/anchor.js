/**
 * 将 <a href="#xxx">xxx</a> 转换为 <a href="url#xxx">xxx</a>, 使得docsify 正常渲染
 */
(function () {
  let fileRoute = "";
  function main(hook, vm) {
    hook.beforeEach(function (html) {
      fileRoute = vm.route.path;
      return html;
    });
    hook.doneEach(function () {
      modifyDocsifyLink();
    });
  }
  function modifyDocsifyLink() {
    const links = document.querySelectorAll("a.Docsify");
    links.forEach((link) => {
      const relative = link.attributes.href.value;
      const rootPath = fileRoute;
      link.href = "#" + rootPath + relative;
    });
  }
  function install() {
    docsifyPlugins.push(main);
  }
  install();
})();
