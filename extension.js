// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

const fs = require('fs')
const path = require('path')

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "todo-md" is now active!');


    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.gitCommitComment', function () {
        // The code you place here will be executed every time your command is executed

        let rootPath = vscode.workspace.rootPath

        fs.readFile(path.join(rootPath, "TODO.MD"), (err, data) => {
            if (err) {
                vscode.window.showErrorMessage("Can't find TODO.MD in your workspace.")
                return;
            }

            const Git = require('simple-git')(vscode.workspace.rootPath)
            Git.show(['HEAD:TODO.MD'], (err, result) => {
                if (err) {
                    vscode.window.showErrorMessage(err)
                    return;
                }
                var editor = vscode.window.activeTextEditor;
                editor.edit(function (editBuilder) {
                    editBuilder.insert(editor.selection.start, result);
                })

            })

        });


        // Display a message box to the user

    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;