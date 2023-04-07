const path = require("path");
const fs = require("fs");
const {
  extractDependencies,
  splitToParts,
  parsePart,
  isLocal,
  partition,
  splitToLocalChunks,
  parseChunk,
  parse,
} = require("../parse.js");

const currentDir = path.dirname(__filename);
const rootPath = path.join(currentDir, "../..");
const assets = path.join(rootPath, "utils/assets");
const samplePath = path.join(assets, "sample.md");
const outputPath = path.join(assets, "output.json");

const sampleContent = fs.readFileSync(samplePath, "utf-8");

async function testPattern(func) {
  console.log(`Test ${func.name}()------------------------------`);
  await func();
  console.log(`-------------------------------------------------`);
}
const testFuncs = [
  async function testContent() {
    console.log(sampleContent);
  },

  async function testSplitToParts() {
    const parts = splitToParts(sampleContent);
    console.log(parts);
  },

  async function testParts() {
    const parts = splitToParts(sampleContent);
    const [headPart, ...restParts] = parts;
    console.log("####: header");
    console.log(headPart);
    console.log("####: rest");
    console.log(restParts);
  },

  async function testExternal() {
    const parts = splitToParts(sampleContent);
    const [headPart, ...restParts] = parts;
    const chunks = restParts.map(parsePart);
    const [[localRawChunk], externalChunks] = partition(chunks, isLocal);

    console.log("####: external");
    console.log(externalChunks);
    console.log("####: local Raw");
    console.log(localRawChunk);
  },

  async function testLocal() {
    const parts = splitToParts(sampleContent);
    const [headPart, ...restParts] = parts;
    const chunks = restParts.map(parsePart);
    const [[localRawChunk], externalChunks] = partition(chunks, isLocal);
    const localChunks = localRawChunk ? splitToLocalChunks(localRawChunk) : [];
    console.log(localChunks);
  },

  async function testParse() {
    const parsed = parse("hi/sample", sampleContent);
    console.log(parsed);
  },

  async function testOuput() {
    const parsed = parse("hi/sample", sampleContent);
    fs.writeFile(outputPath, JSON.stringify(parsed), (err) => {});
  },

  async function testNewIndex() {
    const content =
      "\n写入的时候, 只与当前 table 有关, 则写入当前的 class, 如果存在, 则写入 value 当中,并且调用 setter\n\n<docs-expose>\n\n- table\n- key\n- value\n\n</docs-expose>\n";
  },
];

async function main() {
  for (const func of testFuncs) {
    await testPattern(func);
  }
}

main();
