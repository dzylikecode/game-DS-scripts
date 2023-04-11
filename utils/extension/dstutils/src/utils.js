const vscode = require("vscode");
const path = require("path");
/**
 *
 * @param {vscode.Uri} uri
 * @returns
 */
function getWorkspaceFolderPath(uri) {
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

  // NOTE: rootPath seems to be deprecated but seems like the best fallback so that
  // single project workspaces still work. If I come up with a better option, I'll change it.
  return workspaceFolder
    ? workspaceFolder.uri.fsPath
    : vscode.workspace.rootPath;
}

/**
 *
 * @param {string} filePath
 * @param {string} rootPath
 * @param {{src:{dir:string, ext:string}, dst:{dir:string, ext:string}, exclude:string[]}[]} mapRules
 */
function mapToVirtual(filePath, rootPath, mapRules) {
  const match = mapRules.find(
    ({ src }) =>
      filePath.endsWith(src.ext) && inFolder(getDir(src.dir), filePath)
  );
  if (!match) return;
  if (isExcludedFile(filePath)) return;
  const filePathWithoutExt = filePath.slice(0, -match.src.ext.length);
  const srcDir = getDir(match.src.dir);
  const dstDir = getDir(match.dst.dir);
  const virtualName = path
    .relative(srcDir, filePathWithoutExt)
    .replace(/\\/g, "/");
  const dstFile = path.join(dstDir, virtualName + match.dst.ext);

  return {
    rule: match,
    srcDir,
    srcFile: filePath,
    dstDir,
    dstFile,
    virtualName,
  };
  function getDir(dir) {
    return path.join(rootPath, dir);
  }

  function isExcludedFile(filePath) {
    const {
      src: { dir: srcDir, ext: srcExt },
      exclude,
    } = match;
    const srcDirFull = getDir(srcDir);
    const filePathWithoutExt = filePath.slice(0, -srcExt.length);
    const relMdDir = path
      .relative(srcDirFull, filePathWithoutExt)
      .replace(/\\/g, "/");
    return exclude.some((ex) => relMdDir.startsWith(ex));
  }
}

function inFolder(folder, filePath) {
  const relPath = path.relative(folder, filePath);
  return relPath && !relPath.startsWith("..");
}

module.exports = {
  getWorkspaceFolderPath,
  mapToVirtual,
};
