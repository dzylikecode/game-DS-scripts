const path = require("path");
const fs = require("fs");
const p = require("../parse.js");
const g = require("../generateCache.js");

const currentDir = path.dirname(__filename);
const rootPath = path.join(currentDir, "../..");
const mdDir = path.join(rootPath, "utils/assets/md");
const cacheDir = path.join(rootPath, "utils/assets/cache");
const outPath = path.join(mdDir, "out.md");
const inPath = path.join(mdDir, "in/in.md");

async function testPattern(func) {
  console.log(`Test ${func.name}()------------------------------`);
  await func();
  console.log(`-------------------------------------------------`);
}
const testFuncs = [
  async function test_RelativePath() {
    const virtualOutMdPath = path.relative(mdDir, outPath);
    const virtualInMdPath = path.relative(mdDir, inPath);
    console.log(`out:${virtualOutMdPath}`);
    console.log(`in: ${virtualInMdPath}`);
  },
  async function test_VirtualName() {
    const virtualOutMdPath = path.relative(mdDir, outPath);
    const virtualInMdPath = path.relative(mdDir, inPath);
    const virtualOutPath = getVirtualName(virtualOutMdPath);
    const virtualInPath = getVirtualName(virtualInMdPath);
    console.log(`out:`);
    console.log(virtualOutPath);
    console.log(`in:`);
    console.log(virtualInPath);

    function getVirtualName(filePath) {
      const { dir, name } = path.parse(filePath);
      return path.join(dir, name);
    }
  },

  async function testGenerate() {
    g.generate(mdDir, outPath, cacheDir);
    g.generate(mdDir, inPath, cacheDir);
  },

  async function test_findFile() {
    const files = fs.readdirSync(mdDir, { withFileTypes: true });
    console.log(files);
  },

  async function test_checkFileType() {
    const files = fs.readdirSync(mdDir, { withFileTypes: true });
    console.log(files[0].isDirectory());
    console.log(files[1].isFile());
  },

  async function test_getAllFiles() {
    const files = getAllFiles(mdDir, { withFileTypes: true });
    for (const file of files) {
      console.log(file);
    }

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
  },
];

async function main() {
  for (const func of testFuncs) {
    await testPattern(func);
  }
}

main();
