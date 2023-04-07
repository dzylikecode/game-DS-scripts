const vscode = require("vscode");
const g = require("./utils/generateCache.js");
const path = require("path");

const mdMaps = [
  {
    mdDir: "docs/dont-starve",
    cacheDir: "assets/cache/dont-starve",
    cbDeps: prefixName("/dont-starve"),
  },
  {
    mdDir: "docs/dont-starve-together",
    cacheDir: "assets/cache/dont-starve-together",
    cbDeps: prefixName("/dont-starve-together"),
  },
];

function inFolder(folder, filePath) {
  const relPath = path.relative(folder, filePath);
  return relPath && !relPath.startsWith("..");
}

/**
 *
 * @param {string} prefix
 * @returns
 */
function prefixName(prefix) {
  /**
   * @param {string} name
   */
  return function (name) {
    return prefix + "/" + name;
  };
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const extension = new DstUtilsExtension(context);
  extension.showOutputMessage('Congratulations, "dstutils" is now active!');

  vscode.workspace.onDidSaveTextDocument((document) => {
    extension.onSave(document);
  });

  vscode.workspace.onDidDeleteFiles((fileDeleteEvent) => {
    extension.onDelete(fileDeleteEvent.files);
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

class DstUtilsExtension {
  /**
   *
   * @param {vscode.ExtensionContext} context
   */
  constructor(context) {
    this._context = context;
    this._outputChannel = vscode.window.createOutputChannel(
      "Don't Starve Together Utils"
    );
  }

  /**
   *
   * @param {vscode.TextDocument} document
   */
  async onSave(document) {
    const filePath = document.fileName;
    if (!filePath.endsWith(".md")) return;

    const workspaceFolderPath = this._getWorkspaceFolderPath(document.uri);

    const match = mdMaps.find(({ mdDir }) => inFolder(getDir(mdDir), filePath));
    if (match) {
      const { mdDir, cacheDir, cbDeps } = match;
      const mdDirFull = getDir(mdDir);
      const cacheDirFull = getDir(cacheDir);
      try {
        await g.generate(mdDirFull, filePath, cacheDirFull, cbDeps);
        this.showStatusMessage(`${filePath} -> ${cacheDirFull}`);
      } catch (err) {
        this.showOutputMessage(err);
      }
    }

    function getDir(dir) {
      return path.join(workspaceFolderPath, dir);
    }
  }
  /**
   *
   * @param {readonly vscode.Uri[]} files
   */
  async onDelete(files) {
    for (const file of files) {
      const filePath = file.fsPath;
      if (!filePath.endsWith(".md")) return;

      const workspaceFolderPath = this._getWorkspaceFolderPath(file);

      const match = mdMaps.find(({ mdDir }) =>
        inFolder(getDir(mdDir), filePath)
      );
      if (match) {
        const { mdDir, cacheDir, cbDeps } = match;
        const mdDirFull = getDir(mdDir);
        const cacheDirFull = getDir(cacheDir);
        try {
          await g.remove(mdDirFull, filePath, cacheDirFull);
          this.showStatusMessage(`remove ${filePath}`);
        } catch (err) {
          this.showOutputMessage(err);
        }
      }

      function getDir(dir) {
        return path.join(workspaceFolderPath, dir);
      }
    }
  }
  /**
   *
   * @param {vscode.Uri} uri
   * @returns
   */
  _getWorkspaceFolderPath(uri) {
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);

    // NOTE: rootPath seems to be deprecated but seems like the best fallback so that
    // single project workspaces still work. If I come up with a better option, I'll change it.
    return workspaceFolder
      ? workspaceFolder.uri.fsPath
      : vscode.workspace.rootPath;
  }

  /**
   * @param {string} message
   * Show message in output channel
   */
  showOutputMessage(message) {
    this._outputChannel.appendLine(message);
  }

  /**
   * @param {string} message
   * Show message in status bar and output channel.
   * Return a disposable to remove status bar message.
   */
  showStatusMessage(message) {
    this.showOutputMessage(message);
    return vscode.window.setStatusBarMessage(message);
  }
}
