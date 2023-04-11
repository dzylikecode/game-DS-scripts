/**
 * - requre "folder/file"
 * extract: folder/file
 */
const dependencyRule = /- require\s"(.+)".*/g;
const asRule = /- (.+?)\s=\srequire\s"(.+)".*/g;
const returnRule = /- return\s(.+).*/g;
const exposeRule = /<docs-expose>(.*?)<\/docs-expose>/gs;

/**
 *
 * @param {string} content
 * @returns
 */
function parseHeader(content) {
  const deps = Array.from(content.matchAll(dependencyRule)).map(
    (match) => match[1]
  );
  const as = Array.from(content.matchAll(asRule)).map((match) => {
    return { [match[1]]: match[2] };
  });
  const ret = content.match(returnRule);
  return {
    deps,
    as,
    ret: ret ? ret[1] : null,
  };
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
  const id = part.slice(0, firstNewLinePos).replace(/\\/g, "");
  const content = part.slice(firstNewLinePos + 1);
  return {
    id,
    content: content,
  };
}

function isLocal(chunk) {
  return chunk.id === "local";
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
  const chunks = parts.map(parsePart).filter((chunk) => chunk.id != "");
  return chunks;
}

function parseChunk(chunk) {
  const info = Array.from(chunk.content.matchAll(exposeRule))
    .map((match) => match[1])
    .join("<hr>");
  return {
    id: chunk.id,
    info,
  };
}

function parse(virtualName, text) {
  const parts = splitToParts(text);
  const [headPart, ...restParts] = parts;
  const { as, deps, ret } = parseHeader(headPart);
  const chunks = restParts
    .map(parsePart)
    .filter((chunk) => chunk.id != "" && chunk.id != "References");
  const [[localRawChunk], externChunks] = partition(chunks, isLocal);
  const localChunks = localRawChunk ? splitToLocalChunks(localRawChunk) : [];
  return {
    id: virtualName,
    as,
    deps,
    ret,
    extern: externChunks.map((chunk) => parseChunk(chunk)),
    local: localChunks.map((chunk) => parseChunk(chunk)),
  };
}

module.exports = {
  parseHeader,
  splitToParts,
  parsePart,
  isLocal,
  partition,
  splitToLocalChunks,
  parseChunk,
  parse,
};
