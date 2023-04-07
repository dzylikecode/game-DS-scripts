const g = require("./generateCache.js");
const path = require("path");
const fs = require("fs");

const currentDir = path.dirname(__filename);
const rootPath = path.join(currentDir, "..");
const dtDocsDir = path.join(rootPath, "docs/dont-starve");
const dtCacheDir = path.join(rootPath, "assets/cache/dont-starve");

function* getAllFiles(dir) {
  const contents = fs.readdirSync(dir, { withFileTypes: true });
  for (const content of contents) {
    const res = path.join(dir, content.name);
    if (content.isDirectory()) {
      yield* getAllFiles(res);
    } else {
      yield res;
    }
  }
}

function generateCache(mdDir, cacheDir, prefix = "") {
  // generate cache for each file
  for (const mdPath of getAllFiles(mdDir)) {
    if (mdPath.endsWith(".md")) g.generate(mdDir, mdPath, cacheDir, prefixName);
  }

  function prefixName(name) {
    return prefix + "/" + name;
  }

  console.log(`${mdDir}: done!`);
}

generateCache(dtDocsDir, dtCacheDir, "/dont-starve");
