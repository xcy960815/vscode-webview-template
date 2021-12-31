"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require('path');
const fs = require('fs');
/**
 * 创建vscode webview 的容器
 * @returns vscode.WebviewPanel
 */
const createWebviewPanel = () => {
    // 创建 webview 容器
    return vscode.window.createWebviewPanel('webview', '欢迎使用webview模板', vscode.ViewColumn.One, {
        enableScripts: true,
        retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
    });
};
/**
 * 获取文件的 绝对路径
 * @param context vscode 上下文
 * @param relativePath 要加载的文件的绝对路径
 * @returns
 */
const getHtmlAbsolutePath = (context, relativePath) => {
    return path.join(context.extensionPath, relativePath);
};
/**
 * 获取要加载的html文件内容
 * @param context vscode 上下文
 * @param relativePath 要加载的文件的绝对路径
 * @returns
 */
const getWebviewContent = (context, relativePath) => {
    const htmlFilePath = getHtmlAbsolutePath(context, relativePath);
    const documentPath = path.dirname(htmlFilePath);
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');
    // vscode不支持直接加载本地资源，需要替换成其专有路径格式，这里只是简单的将样式和JS的路径替换
    htmlContent = htmlContent.replace(/(<link.+?href="|<script.+?src="|<img.+?src=")(.+?)"/g, (_m, $1, $2) => {
        return ($1 +
            vscode.Uri.file(path.resolve(documentPath, $2))
                .with({ scheme: 'vscode-resource' })
                .toString() +
            '"');
    });
    return htmlContent;
};
/**
 * 创建状态栏
 * @param statusBarText  状态栏的文本
 * @param textColor  状态栏文本的颜色
 * @returns vscode.StatusBarItem
 */
const createStatusBarItem = (statusBarText = '你好，前端艺术家！', textColor = 'yellow') => {
    const statusBarItem = vscode.window.createStatusBarItem();
    statusBarItem.text = statusBarText;
    statusBarItem.color = textColor;
    statusBarItem.show();
    return statusBarItem;
};
/**
 *
 * @param context vscode 上下文
 */
function default_1(context) {
    return __awaiter(this, void 0, void 0, function* () {
        // 创建状态栏
        const statusBarItem = createStatusBarItem();
        // 创建 webview 容器
        const webviewPanel = yield createWebviewPanel();
        webviewPanel.webview.html = getWebviewContent(context, 'src/webview/webview.html' /*以当前项目的根路径为标准 查找文件路径*/);
        // 当 webview 容器 发生变更的时候
        webviewPanel.onDidChangeViewState(() => {
            if (webviewPanel.visible) {
                statusBarItem.show();
            }
            else {
                statusBarItem.hide();
            }
        });
        // 当 webview 容器 销毁的时候
        webviewPanel.onDidDispose((e) => {
            statusBarItem.dispose();
        });
    });
}
exports.default = default_1;
//# sourceMappingURL=html-loader.js.map