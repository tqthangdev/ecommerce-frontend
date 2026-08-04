export function hasRole(
  roles: string[] | undefined,
  role: string
) {
  return roles?.includes(role) ?? false;
}

export function canAccessAdmin(
  roles: string[] | undefined
) {
  return (
    roles?.includes("ADMIN") ||
    roles?.includes("OWNER")
  ) ?? false;
}