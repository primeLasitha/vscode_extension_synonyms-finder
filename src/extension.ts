
import fetch from 'node-fetch';
import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {


	console.log('Congratulations, your extension "helloworld" is now active!');

	let disposable = vscode.commands.registerCommand('extension.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage('editor does not exist !');
			return;
		}
		const text = editor.document.getText(editor.selection);

		//finding the word
		const response = await fetch(`https://api.datamuse.com/words?ml=${text}`);
		const data = await response.json();

		//add to the quick pick; ref https://github.com/microsoft/vscode-extension-samples/blob/master/quickinput-sample/src/extension.ts
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = data.map((x: any) => ({ label: x.word }));
		quickPick.onDidChangeSelection(([item]) => {
			if (item) {
				vscode.window.showInformationMessage(item.label);
				editor.edit(edit => {
					edit.replace(editor.selection, item.label);
				});

				quickPick.dispose();
			}
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
