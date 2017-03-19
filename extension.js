// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode')
const fs = require('fs')
const path = require('path')
const ncp = require('copy-paste')

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



        function parseDone(content) {
            var done = /(?=\s*)[-\*] {0,2}\[x\].*$/gmi;
            return content.match(done)
        }
        let rootPath = vscode.workspace.rootPath

        if (!rootPath) {
            var editor = vscode.window.activeTextEditor;
            if (editor) {
                let doc = editor.document;
                let array = doc.fileName.match(/^.*?(?=\.git)/)
                if (array && array.length == 1) {
                    rootPath = array[0];
                } else {
                    vscode.window.showErrorMessage("Can't find git repository.");
                    return;
                }

            } else {
                vscode.window.showInformationMessage("Can't find ether TODO.MD or git repository.");
                return;
            }
        }


        fs.readFile(path.join(rootPath, "TODO.MD"), "utf-8", (err, data) => {
            if (err) {
                vscode.window.showErrorMessage("Can't find TODO.MD in your workspace.")
                return;
            }

            var newDoneList = parseDone(data)

            const Git = require('simple-git')(rootPath)
            Git.show(['HEAD:TODO.MD'], (err, result) => {
                if (err) {
                    vscode.window.showErrorMessage(err)
                    return;
                }
                var oldDoneList = parseDone(result)

                if (newDoneList.length > 0) {
                    var set = new Set(newDoneList)

                    if (oldDoneList) {
                        oldDoneList.forEach((done) => {
                            set.delete(done)
                        })
                    }

                }

                if (set, set.size == 0) {
                    vscode.window.showInformationMessage("No finished Todo.")
                    return
                }
                var editor = vscode.window.activeTextEditor;
                if (editor) {
                    editor.edit(function (editBuilder) {
                        set.forEach((done) => {
                            editBuilder.insert(editor.selection.start, done + "\n");

                        })
                    })
                } else {
                    var result = "";
                    for (let done of set) {
                        result = result + done + "\n"
                    }

                    ncp.copy(result, () => {
                        vscode.window.showInformationMessage("Copyed " + set.size + " item into clipboard.")
                    })
                }


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