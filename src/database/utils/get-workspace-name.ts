export const WORKSPACE_PREFIX = 'workspace_';

export function getWorkspaceName(id: string): string {
	return `${WORKSPACE_PREFIX}${id}`;
}
