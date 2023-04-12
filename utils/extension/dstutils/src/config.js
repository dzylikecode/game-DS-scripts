const vscode = require("vscode");

class ExtensionConfig {
  constructor() {}
  loadConfig() {
    this._config = vscode.workspace.getConfiguration("dstutils");
    this.mdToCode = this.mapRules.map((c) => ({
      src: { dir: c.mdDir, ext: ".md" },
      dst: { dir: c.codeDir, ext: c.ext },
      exclude: c.exclude,
    }));
    this.codeToMd = this.mapRules.map((c) => ({
      src: { dir: c.codeDir, ext: c.ext },
      dst: { dir: c.mdDir, ext: ".md" },
      exclude: c.exclude,
    }));
    this.mdToCache = this.mapRules.map((c) => ({
      src: { dir: c.mdDir, ext: ".md" },
      dst: { dir: c.cacheDir, ext: ".json" },
      exclude: c.exclude,
    }));
  }
  get mapRules() {
    return this._config.get("mapRules");
  }
}

module.exports = new ExtensionConfig();
