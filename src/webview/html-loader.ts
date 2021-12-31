import * as vscode from 'vscode'
const path = require('path')
const fs = require('fs')
/**
 * 创建vscode webview 的容器
 * @returns vscode.WebviewPanel
 */
const createWebviewPanel = (): vscode.WebviewPanel => {
    // 创建 webview 容器
    return vscode.window.createWebviewPanel(
        'webview',
        '欢迎使用webview模板',
        vscode.ViewColumn.One,
        {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
        }
    )
}
/**
 * 获取文件的 绝对路径
 * @param context vscode 上下文
 * @param relativePath 要加载的文件的绝对路径
 * @returns
 */
const getHtmlAbsolutePath = (
    context: vscode.ExtensionContext,
    relativePath: string
): string => {
    return path.join(context.extensionPath, relativePath)
}
/**
 * 获取要加载的html文件内容
 * @param context vscode 上下文
 * @param relativePath 要加载的文件的绝对路径
 * @returns
 */
const getWebviewContent = (
    context: vscode.ExtensionContext,
    relativePath: string
): string => {
    const htmlFilePath = getHtmlAbsolutePath(context, relativePath)
    const documentPath = path.dirname(htmlFilePath)
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8')
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    htmlContent = htmlContent.replace(
        /(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g,
        (_m: string, $1: string, $2: string) => {
            return (
                $1 +
                vscode.Uri.file(path.resolve(documentPath, $2))
                    .with({ scheme: 'vscode-resource' })
                    .toString() +
                '"'
            )
        }
    )
    return htmlContent
}
/**
 * 创建状态栏
 * @param statusBarText  状态栏的文本
 * @param textColor  状态栏文本的颜色
 * @returns vscode.StatusBarItem
 */
const createStatusBarItem = (
    statusBarText: string = '你好，前端艺术家！',
    textColor: string | vscode.ThemeColor | undefined = 'yellow'
): vscode.StatusBarItem => {
    const statusBarItem = vscode.window.createStatusBarItem()
    statusBarItem.text = statusBarText
    statusBarItem.color = textColor
    statusBarItem.show()
    return statusBarItem
}
/**
 *
 * @param context vscode 上下文
 */
export default async function (context: vscode.ExtensionContext) {
    // 创建状态栏
    const statusBarItem = createStatusBarItem()
    // 创建 webview 容器
    const webviewPanel = await createWebviewPanel()
    webviewPanel.webview.html = getWebviewContent(
        context,
        'src/webview/webview.html' /*以当前项目的根路径为标准 查找文件路径*/
    )
    // 当 webview 容器 发生变更的时候
    webviewPanel.onDidChangeViewState(() => {
        if (webviewPanel.visible) {
            statusBarItem.show()
        } else {
            statusBarItem.hide()
        }
    })
    // 当 webview 容器 销毁的时候
    webviewPanel.onDidDispose((e) => {
        statusBarItem.dispose()
    })
}
