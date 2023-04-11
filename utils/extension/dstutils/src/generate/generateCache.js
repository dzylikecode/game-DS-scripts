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

function generate(srcPath, dstPath, virtualName) {
  const srcContent = fs.readFileSync(srcPath, "utf-8");
  const dstContent = JSON.stringify(p.parse(virtualName, srcContent));
  return writeFile(dstPath, dstContent);
}

function remove(dstPath) {
  return deleteFile(dstPath);
}

module.exports = { generate, remove };
