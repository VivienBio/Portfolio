const DEFAULT_ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*.run.app'] as const;

export function resolveAllowedHosts(configuredHosts?: string): string[] {
  const customHosts = configuredHosts
    ?.split(',')
    .map((host) => host.trim())
    .filter((host) => host.length > 0);

  return [...new Set([...DEFAULT_ALLOWED_HOSTS, ...(customHosts ?? [])])];
}
