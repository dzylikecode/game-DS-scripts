const p = require("./parse.js");
const path = require("path");
const fs = require("fs");

function writeFile(dst, content) {
  const dir = path.dirname(dst);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return new Promise((resolve, reject) => {
    fs.writeFile(dst, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function deleteFile(dst) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dst))
      fs.unlink(dst, (err) => {
        if (err) reject(err);
        resolve();
      });
    resolve();
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
  return writeFile(jsonPath, jsonContent);
}

function remove(mdRootDir, mdPath, cacheDir) {
  const virtualPath = getVirtualPath(mdRootDir, mdPath);
  const jsonPath = path.join(cacheDir, virtualPath + ".json");
  return deleteFile(jsonPath);
}

module.exports = { generate, remove };
