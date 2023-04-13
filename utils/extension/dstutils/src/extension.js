const vscode = require("vscode");
const g = require("./generate/generateCache.js");
const d = require("./generateDocs.js");
const { openLeft, openRight } = require("./openFile.js");
const logger = require("./logger.js");
const { getWorkspaceFolderPath, mapToVirtual } = require("./utils.js");
const config = require("./config.js");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  logger.init();
  logger.log('Congratulations, "dstUtils" is now active!');
  config.loadConfig();

  vscode.workspace.onDidChangeConfiguration(() => {
    config.loadConfig();
  });

  vscode.workspace.onDidSaveTextDocument((document) => {
    onSave(document.uri);
  });

  vscode.workspace.onDidDeleteFiles((fileDeleteEvent) => {
    fileDeleteEvent.files.forEach((f) => onDelete(f));
  });

  vscode.workspace.onDidRenameFiles((fileRenameEvent) => {
    fileRenameEvent.files.forEach((f) => {
      onDelete(f.oldUri);
      onSave(f.newUri);
    });
  });

  const registerCommand = (menu, fn) =>
    context.subscriptions.push(vscode.commands.registerCommand(menu, fn));
  registerCommand("dstutils.openCode", () =>
    openCode(vscode.window.activeTextEditor.document.uri)
  );
  registerCommand("dstutils.openMarkdown", () =>
    openMd(vscode.window.activeTextEditor.document.uri)
  );
  registerCommand("dstutils.generateSummary", () =>
    generateSummary(vscode.window.activeTextEditor.document.uri)
  );
  registerCommand("dstutils.generateMarkdown", () =>
    generateDocs(vscode.window.activeTextEditor.document.uri)
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

/**
 *
 * @param {vscode.Uri} uri
 */
async function onSave(uri) {
  const filePath = uri.fsPath;
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const res = mapToVirtual(filePath, workspaceFolderPath, config.mdToCache);
  if (!res) return;

  try {
    await g.generate(res.srcFile, res.dstFile, res.virtualName);
    logger.log(`${res.srcFile} -> ${res.dstFile}`);
  } catch (err) {
    logger.log(err);
  }
}
/**
 *
 * @param {vscode.Uri} uri
 */
async function onDelete(uri) {
  const filePath = uri.fsPath;
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const res = mapToVirtual(filePath, workspaceFolderPath, config.mdToCache);
  if (!res) return;

  try {
    await g.remove(res.dstFile);
    logger.log(`remove ${res.dstFile}`);
  } catch (err) {
    logger.log(err);
  }
}

function openCode(uri) {
  const filePath = uri.fsPath;
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const res = mapToVirtual(filePath, workspaceFolderPath, config.mdToCode);
  if (!res) {
    logger.log(`${filePath} not match any rule or excluded`);
    return;
  }
  return openRight(res.dstFile);
}

function openMd(uri) {
  const filePath = uri.fsPath;
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const res = mapToVirtual(filePath, workspaceFolderPath, config.codeToMd);
  if (!res) {
    logger.log(`${filePath} not match any rule or excluded`);
    return;
  }
  return openLeft(res.dstFile);
}

function generateSummary(uri) {
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const res = config.mapRules.map((r) => ({
    mdDir: getFullPath(r.mdDir),
  }));
  res.forEach((r) => {
    d.generateSummary(r.mdDir, workspaceFolderPath);
  });
  logger.log("generate Summary done");
  function getFullPath(dir) {
    return path.join(workspaceFolderPath, dir);
  }
}

function generateDocs(uri) {
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const res = config.mapRules.map((r) => ({
    mdDir: getFullPath(r.mdDir),
    codeDir: getFullPath(r.codeDir),
    ext: r.ext,
  }));
  res.forEach((r) => {
    d.generateDocs(r.mdDir, r.codeDir, workspaceFolderPath, r.ext);
  });
  logger.log("generate Markdown done");
  function getFullPath(dir) {
    return path.join(workspaceFolderPath, dir);
  }
}
