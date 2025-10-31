/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { workspace } from 'vscode';
import { type IRuntimeVersionMapping, RuntimeVersionMappings } from '../constants';
import { localize } from '../localize';

/**
 * Validates that the external runtime configuration is supported
 */
export function validateExternalRuntimeConfig(runtimeName: string, runtimeVersion: string): void {
    const runtimeKey: string = runtimeName.toLowerCase();
    const availableMappings: IRuntimeVersionMapping[] | undefined = RuntimeVersionMappings[runtimeKey];

    if (!availableMappings) {
        throw new Error(localize('unsupportedRuntime', 'Unsupported runtime: {0}. Supported runtimes: {1}',
            runtimeName, Object.keys(RuntimeVersionMappings).join(', ')));
    }

    const mapping: IRuntimeVersionMapping | undefined = availableMappings.find(m => m.version === runtimeVersion);
    if (!mapping) {
        const supportedVersions: string = availableMappings.map(m => m.version).join(', ');
        throw new Error(localize('unsupportedVersion', 'Unsupported version {0} for runtime {1}. Supported versions: {2}',
            runtimeVersion, runtimeName, supportedVersions));
    }
}

/**
 * Gets the current workspace path or throws an error if none exists
 */
export function getCurrentWorkspacePath(): string {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        throw new Error(localize('noWorkspaceOpen', 'No workspace is currently open'));
    }
    return workspaceFolders[0].uri.fsPath;
}

/**
 * Gets runtime mapping for interpretation by wizard steps
 */
export function getRuntimeMapping(runtimeName: string, runtimeVersion: string): IRuntimeVersionMapping | undefined {
    const runtimeKey: string = runtimeName.toLowerCase();
    const availableMappings: IRuntimeVersionMapping[] | undefined = RuntimeVersionMappings[runtimeKey];
    return availableMappings?.find(m => m.version === runtimeVersion);
}/**
 * Validates runtime name and version parameters
 */
export function validateRuntimeParams(runtimeName: unknown, runtimeVersion: unknown): asserts runtimeName is string {
    if (!runtimeName || typeof runtimeName !== 'string') {
        throw new Error(localize('missingRuntimeName', 'Runtime name is required'));
    }

    if (!runtimeVersion || typeof runtimeVersion !== 'string') {
        throw new Error(localize('missingRuntimeVersion', 'Runtime version is required'));
    }

    // Validate that the runtime/version combination is supported
    validateExternalRuntimeConfig(runtimeName, runtimeVersion);
}
