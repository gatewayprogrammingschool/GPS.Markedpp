'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { writeFile, readFile } from 'fs';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"gps-markdpp" is now active.');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        'gps-markdown.transformMarkdown', () => {
            // The code you place here will be executed every time your command is executed
            if(!vscode.workspace.workspaceFolders) {
                vscode.window.showErrorMessage("No workspace folder.");
                return;
            }
            
            var rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
            var markedppOptions = new MarkedppOptions();
            markedppOptions.initialize(context).then((result) => {
                if (!result) {
                    vscode.window.showInformationMessage(
                        "Used default configuration.  Check your config file.");
                }

                try {
                    if (markedppOptions.rootSourceFiles.length > 0) {
                        markedppOptions.rootSourceFiles.forEach(sourceFile => {
                            var markedpp = require('markedpp'),
                                options = markedppOptions.options;

                            var filename = "";
                            filename = require('path').join(rootFolder, sourceFile).toString();

                            sourceFile = require('path').basename(filename);

                            var path = filename.substring(0, filename.length - (filename.replace(/^.*[\\\/]/, '')).length);

                            options.dirname = path;

                            var destination = "";
                            destination = require('path').join(rootFolder, markedppOptions.outputDirectory);

                            readFile(filename, (err, data) => {
                                if (err) {
                                    throw err;
                                }

                                markedpp(data.toString(), options, function (err: any, result: string) {
                                    writeResult(destination, result, sourceFile);
                                });
                            });

                        });

                        // Display a message box to the user
                        vscode.window.showInformationMessage('Transform Complete.');
                    }
                    else {
                        vscode.window.showWarningMessage('No files to process.');
                    }
                }
                catch (err) {
                    vscode.window.showErrorMessage("Transformation was unsuccessful.");
                }
            }).catch((err) => {
                vscode.window.showErrorMessage(err);
            });
        });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function writeResult(
    path: string, 
    result: string,
    filename: string) {
    var file = require('path').join(path, filename.replace(/^.*[\\\/]/, ''));

    writeFile(file, result, null, (err) => {
        vscode.window.showErrorMessage(err.message);
        console.error(err);
    });
}

class MarkedppOptions {
    rootSourceFiles: Array<string> = new Array<string>();
    outputDirectory: string = '.';
    options: any = {
        gfm: true,          // consider gfm fences
        include: true,      // enable !includes
        toc: true,          // enable !toc
        numberedheadings: true, // enable !numberedheadings
        ref: true,          // enable !ref

        breaks: true,       // render <br> tags for Table of Contents with numbered style
        tags: true,         // render pre-proc tags <!-- !command -->
        level: 3,           // default level for !toc and !numberheadings
        minlevel: 1,        // default minlevel for !toc and !numberheadings

        autonumber: true,   // renumber lists
        autoid: true,       // update identifiers on headings automatically
        githubid: false,    // use github convention for heading auto identifiers
    };

    public initialize(context: vscode.ExtensionContext) {
        return new Promise((resolve, reject) => {
            var path = context.asAbsolutePath('.gps.markedpp');
            vscode.workspace.openTextDocument(path).then((document) => {
                let text = document.getText();
                var json = null;
                try {
                    json = JSON.parse(text);
                    json.rootSourceFiles.forEach(
                        (element: string) => this.addSourceFile(element));

                    this.outputDirectory =
                        json.outputDirectory || this.outputDirectory;

                    this.options = json.options;

                    resolve(true);
                }
                catch (err) {
                    resolve(false);
                }
                resolve(false);
            }, (error) => {
                reject(error);
            });
        });
    }



    public addSourceFile(filename: string) {
        this.rootSourceFiles.push(filename);
    }
}