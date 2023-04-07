const p = require("./parse.js");
const path = require("path");
const fs = require("fs");

function writeFile(dst, content) {
  const dir = path.dirname(dst);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFile(dst, content, (err) => {
    if (err) console.log(err);
  });
}

function getVirtualPath(root, filePath) {
  const relPath = path.relative(root, filePath);
  const { dir, name } = path.parse(relPath);
  return path.join(dir, name);
}

function generate(mdRootDir, mdPath, cacheDir, cbDeps = (x) => x) {
  const virtualPath = getVirtualPath(mdRootDir, mdPath);
  const jsonPath = path.join(cacheDir, virtualPath + ".json");
  const mdContent = fs.readFileSync(mdPath, "utf-8");
  const jsonContent = JSON.stringify(p.parse(virtualPath, mdContent, cbDeps));
  writeFile(jsonPath, jsonContent);
}

module.exports = { generate };
