'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "wc-linegapper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.wc-linegapper', () => {
		// The code you place here will be executed every time your command is executed
		const editor = vscode.window.activeTextEditor;

		// Si el texto seleccionado es null o undefined la función retorna puesto que no tiene nada que hacer.
		if (!editor) { return; }

		// Variable que tiene la selección
		const selection = editor.selection;
		
		// Obtiene el texto seleccionado
		let text = editor.document.getText(selection);
		
		// Pide ingresar el numero de lineas.
		vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => {            
			
			// Valida si es indefinido si no se asigna el numero de lineas.
			let numberOfLines = (value) ? +value : +0;            
			
			// Arreglo para los chunks finales.
			let textInChunks: Array<string> = [];  
			
			// Separa el texto por cambios de linea para identificar cada una de las lineas 
			// y se maneja un index por cada una de las separaciones.
			text.split('\n').forEach((currentLine: string, lineIndex) => {                
				// Agrega la nueva linea a los chunks finales.
				textInChunks.push(currentLine);   
				
				// Si el numero de linea es multiplo del numero de lineas ingresadas como parametro
				// Se ingresa una linea vacia.
				if ((lineIndex+1) % numberOfLines === 0) textInChunks.push('');            
			});

			// Une el arreglo de chunks finales por medio de cambios de lineas.
			text = textInChunks.join('\n');          
			
			// Genera el texto final en la selección de texto.
			editor?.edit((editBuilder) => {                
				let range = new vscode.Range(                    
					selection.start.line, 0,                     
					selection.end.line,                    
					editor?.document.lineAt(selection.end.line).text.length        
					|| 0        
					);                
					editBuilder.replace(range, text);            
				});        
			}); 

		});   
		
		context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
