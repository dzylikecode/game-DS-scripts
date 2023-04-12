const path = require("path");
const fs = require("fs");

const currentDir = path.dirname(__filename);
const rootPath = path.join(currentDir, "..");
const dsDocsDir = path.join(rootPath, "docs/DS");
const dsCodeDir = path.join(rootPath, "code/DS");
const dstDocsDir = path.join(rootPath, "docs/DST");
const dstCodeDir = path.join(rootPath, "code/DST");

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

function createMdFile(filePath) {
  const mdPath = filePath;
  if (fs.existsSync(mdPath)) return;
  const mdDir = path.dirname(mdPath);
  if (!fs.existsSync(mdDir)) fs.mkdirSync(mdDir, { recursive: true });
  const baseName = path.basename(mdPath);
  const content = `# ${baseName}\n\n`;
  return new Promise((resolve, reject) => {
    fs.writeFile(mdPath, content, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function generate(mdDir, codeDir, root, ext) {
  const summaryPath = path.join(mdDir, "SUMMARY.md");
  const readmePath = path.join(mdDir, "README.md");
  const readmeLink = getLink(readmePath);
  const summary = fs.createWriteStream(summaryPath);
  summary.write(`- [:boat:](${readmeLink})\n`);
  generateDocs(mdDir, codeDir);
  summary.end();
  function generateDocs(mdDir, codeDir, tabs = 0) {
    for (const cdDir of getCurSubDirs(codeDir)) {
      const curMdDir = path.join(mdDir, cdDir);
      const curCodeDir = path.join(codeDir, cdDir);
      summary.write(`${" ".repeat(tabs)}- ${cdDir}\n`);
      generateDocs(curMdDir, curCodeDir, tabs + 2);
    }

    for (const codeFile of getCurSubFiles(codeDir)) {
      const mdName = codeFile.slice(0, -ext.length) + ".md";
      const curMdPath = path.join(mdDir, mdName);
      const curMdLink = getLink(curMdPath);
      summary.write(`${" ".repeat(tabs)}- [${mdName}](${curMdLink})\n`);
      createMdFile(curMdPath);
    }

    console.log(`${codeDir}: done!`);

    function getCurSubDirs(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      return items
        .filter((item) => item.isDirectory())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => item.name);
    }

    function getCurSubFiles(dir) {
      const items = fs.readdirSync(dir, { withFileTypes: true });
      return items
        .filter((item) => item.isFile() && item.name.endsWith(ext))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => item.name);
    }
  }

  function getLink(filePath) {
    return "/" + path.relative(root, filePath).replace(/\\/g, "/");
  }
}

generate(dsDocsDir, dsCodeDir, rootPath, ".lua");
generate(dstDocsDir, dstCodeDir, rootPath, ".lua");
