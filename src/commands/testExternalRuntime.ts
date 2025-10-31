/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createTestActionContext } from '@microsoft/vscode-azext-dev';
import { type IActionContext } from '@microsoft/vscode-azext-utils';
import { commands, window } from 'vscode';

/**
 * Mock command to test external runtime initialization
 */
export async function testExternalRuntimeCommand(): Promise<void> {

    try {
        // Test different runtime configurations
        const testConfigs = [
            { id: 'test-ts-18', runtime: 'node', version: '18', description: 'TypeScript (Node) with Node 18' },
            { id: 'test-py-311', runtime: 'python', version: '3.11', description: 'Python 3.11' },
            { id: 'test-py-312', runtime: 'python', version: '3.12', description: 'Python 3.12' },
            { id: 'test-dotnet-9', runtime: 'dotnet', version: '9.0', description: '.NET 9.0' },
            { id: 'test-dotnet-8', runtime: 'dotnet', version: '8.0', description: '.NET 8.0' },
            { id: 'test-dotnet-8-isolated', runtime: 'dotnet-isolated', version: '8.0', description: '.NET 8.0 Isolated' },
            { id: 'test-java-16', runtime: 'java', version: '16', description: 'Java 16' },
            { id: 'test-java-17', runtime: 'java', version: '17', description: 'Java 17' },
        ];

        // Show quick pick to select test configuration
        const selectedConfig = await window.showQuickPick(
            testConfigs.map(config => ({
                label: config.description,
                description: `${config.runtime} ${config.version}`,
                detail: `Function App ID: ${config.id}`,
                config
            })),
            {
                placeHolder: 'Select a runtime configuration to test',
                ignoreFocusOut: true
            }
        );

        if (!selectedConfig) {
            return;
        }

        const { config } = selectedConfig;

        // Show progress
        await window.withProgress({
            location: { viewId: 'workbench.view.explorer' },
            title: `Initializing ${config.description} project...`,
            cancellable: false
        }, async () => {
            await commands.executeCommand(
                'azureFunctions.initializeProjectForSlashAzure',
                {
                    id: config.id,
                    runtimeName: config.runtime,
                    runtimeVersion: config.version
                }
            );
        });

        await window.showInformationMessage(
            `Successfully initialized ${config.description} project!`,
            'OK'
        );

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        await window.showErrorMessage(
            `Failed to initialize project: ${errorMessage}`,
            'OK'
        );
        throw error;
    }
}

/**
 * Quick test command for TypeScript 18 specifically
 */
export async function testTypeScriptExternalRuntime(): Promise<void> {
    const context: IActionContext = await createTestActionContext();

    try {
        await commands.executeCommand(
            'azureFunctions.initializeProjectForSlashAzure',
            context,
            'test-typescript-function-app',
            'typescript',
            '18'
        );

        await window.showInformationMessage(
            'Successfully initialized TypeScript project with Node 18!',
            'OK'
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        await window.showErrorMessage(
            `Failed to initialize TypeScript project: ${errorMessage}`,
            'OK'
        );
        throw error;
    }
}
