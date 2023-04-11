const configs = [
  {
    mdDir: "docs/DS",
    cacheDir: "assets/cache/DS",
    codeDir: "code/DS",
    exclude: ["README", "SUMMARY"],
    ext: ".lua",
  },
  {
    mdDir: "docs/DST",
    cacheDir: "assets/cache/DST",
    codeDir: "code/DST",
    exclude: ["README", "SUMMARY"],
    ext: ".lua",
  },
];

const mdToCache = configs.map((c) => ({
  src: { dir: c.mdDir, ext: ".md" },
  dst: { dir: c.cacheDir, ext: ".json" },
  exclude: c.exclude,
}));

const codeToMd = configs.map((c) => ({
  src: { dir: c.codeDir, ext: c.ext },
  dst: { dir: c.mdDir, ext: ".md" },
  exclude: c.exclude,
}));

const mdToCode = configs.map((c) => ({
  src: { dir: c.mdDir, ext: ".md" },
  dst: { dir: c.codeDir, ext: c.ext },
  exclude: c.exclude,
}));

module.exports = {
  mdToCache,
  codeToMd,
  mdToCode,
};
