// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import htmlLoad from './webview/html-loader'
export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand(
        'vscode-webview-template.helloWorld',
        () => {
            htmlLoad(context)
        }
    )

    context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
export function deactivate() {}
