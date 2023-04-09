// const LuaLocal = {
//   name: "makereadonly",
//   level: "local",
//   location: "/path/to/file.md",
//   description: "make a table readonly",
// };

// const LuaExternal = {
//   name: "makereadonly",
//   level: "external",
//   location: "/path/to/file.md",
//   description: "make a table readonly",
// };

// const LuaModule = {
//   name: "hi/test",
//   dependencies: ["hi/test", "_G"], // 包含了自己, 还有默认的_G
//   local: [LuaLocal],
//   external: [LuaExternal],
// };

/**
 * - requre "folder/file"
 * extract: folder/file
 */
const dependencyRule = /- require\s"(.+)".*/g;
const exposeRule = /<docs-expose>(.*?)<\/docs-expose>/gs;

/**
 *
 * @param {string} content
 * @param {(string) => string} cbDeps
 * @returns
 */
function extractDependencies(content, cbDeps) {
  const dependencies = [];
  const matches = content.matchAll(dependencyRule);
  for (const match of matches) {
    dependencies.push(cbDeps(match[1]));
  }
  return dependencies;
}

/**
 *
 * @param {string} text
 * @returns
 */
function splitToParts(text) {
  return text.split("\n## ");
}

/**
 *
 * @param {string} part
 * @returns
 */
function parsePart(part) {
  const firstNewLinePos = part.indexOf("\n");
  const name = part.slice(0, firstNewLinePos).replace(/\\/g, "");
  const content = part.slice(firstNewLinePos + 1);
  return {
    name,
    content: content,
  };
}

function isLocal(chunk) {
  return chunk.name === "local";
}

function partition(array, isValid) {
  return array.reduce(
    ([pass, fail], elem) => {
      return isValid(elem) ? [[...pass, elem], fail] : [pass, [...fail, elem]];
    },
    [[], []]
  );
}

function splitToLocalChunks(chunk) {
  /**
   * @type {string[]} parts
   */
  const parts = chunk.content.split("\n### ");
  const chunks = parts.map(parsePart).filter((chunk) => chunk.name != "");
  return chunks;
}

function parseChunk(chunk, level, location, cbDeps) {
  const descriptions = [];
  const matches = chunk.content.matchAll(exposeRule);
  for (const match of matches) {
    descriptions.push(match[1]);
  }
  return {
    name: chunk.name,
    level,
    location: cbDeps(location),
    description: descriptions.join("<hr>"),
  };
}

function parse(srcPath, text, cbDeps = (x) => x) {
  const parts = splitToParts(text);
  const [headPart, ...restParts] = parts;
  const dependencies = extractDependencies(headPart, cbDeps);
  const chunks = restParts
    .map(parsePart)
    .filter((chunk) => chunk.name != "" && chunk.name != "References");
  const [[localRawChunk], externalChunks] = partition(chunks, isLocal);
  const localChunks = localRawChunk ? splitToLocalChunks(localRawChunk) : [];
  return {
    name: srcPath,
    dependencies: dependencies.concat([cbDeps("_G"), cbDeps(srcPath)]),
    local: localChunks.map((chunk) =>
      parseChunk(chunk, "local", srcPath, cbDeps)
    ),
    external: externalChunks.map((chunk) =>
      parseChunk(chunk, "external", srcPath, cbDeps)
    ),
  };
}

module.exports = {
  extractDependencies,
  splitToParts,
  parsePart,
  isLocal,
  partition,
  splitToLocalChunks,
  parseChunk,
  parse,
};
