const path = require("path");
const fs = require("fs");

const currentDir = path.dirname(__filename);
const rootPath = path.join(currentDir, "..");
const dtDocsDir = path.join(rootPath, "docs/dont-starve");
const dtCodeDir = path.join(rootPath, "code/dont-starve");

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
  const mdPath = filePath.replace(/\.lua$/, ".md");
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

function generate(mdDir, codeDir, root) {
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

    for (const mdFile of getCurSubFiles(mdDir)) {
      const curMdPath = path.join(mdDir, mdFile);
      const curMdLink = getLink(curMdPath);
      summary.write(`${" ".repeat(tabs)}  - [${mdFile}](${curMdLink})\n`);
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
        .filter((item) => item.isFile())
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((item) => item.name);
    }
  }

  function getLink(filePath) {
    return path.relative(root, filePath).replace(/\\/g, "/");
  }
}

generateDocs(dtDocsDir, dtCodeDir, "/docs/dont-starve");
