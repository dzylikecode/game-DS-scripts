const configs = [
  {
    mdDir: "docs/dont-starve",
    cacheDir: "assets/cache/dont-starve",
    codeDir: "code/dont-starve",
    exclude: ["README", "SUMMARY"],
    ext: ".lua",
  },
  {
    mdDir: "docs/dont-starve-together",
    cacheDir: "assets/cache/dont-starve-together",
    codeDir: "code/dont-starve-together",
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
