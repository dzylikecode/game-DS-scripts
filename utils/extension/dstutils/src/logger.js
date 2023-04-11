const vscode = require("vscode");

class Logger {
  constructor() {}

  init() {
    this.outputChannel = vscode.window.createOutputChannel("dstUtils");
    this.outputChannel.show();
  }

  log(message) {
    this.outputChannel.appendLine(message);
  }
}

module.exports = new Logger();
