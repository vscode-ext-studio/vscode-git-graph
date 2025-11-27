import * as vscode from 'vscode';
import { AvatarManager } from './avatarManager';
import { DataSource } from './dataSource';
import { ExtensionState } from './extensionState';
import { GitGraphView } from './gitGraphView';
import { Logger } from './logger';
import { RepoManager } from './repoManager';
import { LoadGitGraphViewTo } from './types';

/**
 * Serialized state for restoring a Git History View after VS Code restart.
 */
export interface GitGraphViewSerializedState {
    fileUri?: string;
    loadViewTo: LoadGitGraphViewTo;
}

/**
 * Deserializes and restores Git History Views when VS Code restarts.
 */
export class GitGraphViewSerializer implements vscode.WebviewPanelSerializer<GitGraphViewSerializedState> {
    private readonly extensionPath: string;
    private readonly dataSource: DataSource;
    private readonly extensionState: ExtensionState;
    private readonly avatarManager: AvatarManager;
    private readonly repoManager: RepoManager;
    private readonly logger: Logger;

    /**
     * Creates the Git History View Serializer.
     * @param extensionPath The absolute file path of the directory containing the extension.
     * @param dataSource The Git History DataSource instance.
     * @param extensionState The Git History ExtensionState instance.
     * @param avatarManager The Git History AvatarManager instance.
     * @param repoManager The Git History RepoManager instance.
     * @param logger The Git History Logger instance.
     */
    constructor(
        extensionPath: string,
        dataSource: DataSource,
        extensionState: ExtensionState,
        avatarManager: AvatarManager,
        repoManager: RepoManager,
        logger: Logger
    ) {
        this.extensionPath = extensionPath;
        this.dataSource = dataSource;
        this.extensionState = extensionState;
        this.avatarManager = avatarManager;
        this.repoManager = repoManager;
        this.logger = logger;
    }

    /**
     * Deserialize and restore a Git History View panel.
     * @param webviewPanel The webview panel to restore.
     * @param state The serialized state.
     */
    async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: GitGraphViewSerializedState): Promise<void> {
        const fileUri = state.fileUri ? vscode.Uri.parse(state.fileUri) : undefined;
        const loadViewTo = state.loadViewTo || null;

        // Restore the Git History View using the saved state and provided webviewPanel
        GitGraphView.createOrShow(
            this.extensionPath,
            this.dataSource,
            this.extensionState,
            this.avatarManager,
            this.repoManager,
            this.logger,
            loadViewTo,
            fileUri,
            webviewPanel
        );
    }
}
