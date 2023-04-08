const vscode = require("vscode");
const path = require("path");

/**
 *
 * @param {vscode.Uri} uri
 * @param {vscode.ViewColumn} column
 * @param {boolean} preserveFocus
 */
async function openFile(uri, column, preserveFocus) {
  try {
    const document = await vscode.workspace.openTextDocument(uri);
    vscode.window.showTextDocument(document, column);
  } catch (error) {
    console.log(error);
  }
}

function openLeft(uri) {
  const column = vscode.ViewColumn.One;
  return openFile(uri, column, true);
}

function openRight(uri) {
  const column = vscode.ViewColumn.Two;
  return openFile(uri, column, false);
}

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

function codeUriToMdUri(uri) {
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const filePath = uri.fsPath;
  const rCodePath = path.relative(workspaceFolderPath, filePath);
  // 'code/hello/hi.lua' -> 'docs/hello/hi.md'
  const rMdPath = "docs/" + rCodePath.slice(5, -4) + ".md";
  const mdPath = path.join(workspaceFolderPath, rMdPath);
  return vscode.Uri.file(mdPath);
}

function mdUriToCodeUri(uri) {
  const workspaceFolderPath = getWorkspaceFolderPath(uri);
  const filePath = uri.fsPath;
  const rMdPath = path.relative(workspaceFolderPath, filePath);
  // 'docs/hello/hi.md' -> 'code/hello/hi.lua'
  const rCodePath = "code/" + rMdPath.slice(5, -3) + ".lua";
  const codePath = path.join(workspaceFolderPath, rCodePath);
  return vscode.Uri.file(codePath);
}

function openCode(uri) {
  const codeUri = mdUriToCodeUri(uri);
  return openRight(codeUri);
}

function openMd(uri) {
  const mdUri = codeUriToMdUri(uri);
  return openLeft(mdUri);
}

module.exports = {
  openLeft,
  openRight,
  openCode,
  openMd,
};
