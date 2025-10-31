/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { type IActionContext } from '@microsoft/vscode-azext-utils';
import { getCurrentWorkspacePath, validateRuntimeParams } from '../utils/externalRuntimeUtils';
import { type FunctionAppStackValue } from './createFunctionApp/stacks/models/FunctionAppStackModel';
import { createNewProjectInternal } from './createNewProject/createNewProject';

export type RuntimeName = FunctionAppStackValue | 'dotnet-isolated';

interface InitializeProjectForSlashAzureParams {
    id: string;
    runtimeName: RuntimeName;
    runtimeVersion: string;
}

/**
 *
 * Needs to initialize a local project based on the given function app information.
 *
 * @param context
 * @param id id of the function app in Azure
 * @param runtimeName ex: 'node', 'python', 'dotnet', etc.
 * @param runtimeVersion ex: '18', '3.11', '8.0', etc.
 */
export async function initializeProjectForSlashAzure(
    context: IActionContext,
    params: InitializeProjectForSlashAzureParams
): Promise<void> {

    const { id, runtimeName, runtimeVersion } = params;

    // Validate the runtime configuration
    validateRuntimeParams(runtimeName, runtimeVersion);

    context.telemetry.properties.externalRuntimeName = runtimeName;
    context.telemetry.properties.externalRuntimeVersion = runtimeVersion;

    // todo set id in settings as the default app to deploy to
    console.log(id);

    // Initialize the project using the existing createNewProjectInternal with external runtime config
    await createNewProjectInternal(context, {
        folderPath: getCurrentWorkspacePath(),
        suppressOpenFolder: true, // Don't open folder since we're in current workspace
        externalRuntimeConfig: {
            runtimeName,
            runtimeVersion
        }
    });
}
