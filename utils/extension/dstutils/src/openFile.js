const vscode = require("vscode");
const path = require("path");
const u = require("./utils.js");
const logger = require("./logger.js");

/**
 *
 * @param {vscode.Uri} uri
 * @param {vscode.ViewColumn} column
 * @param {boolean} preserveFocus
 */
async function openFile(uri, column, preserveFocus) {
  try {
    const document = await vscode.workspace.openTextDocument(uri);
    vscode.window.showTextDocument(document, column, preserveFocus);
  } catch (error) {
    logger.log(error);
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

module.exports = {
  openLeft,
  openRight,
};
