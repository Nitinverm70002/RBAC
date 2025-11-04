export function can(user, action, resource = null) {
  if (!user) return false;
  // server returns only role; for simplicity derive allowed actions here to match backend config
  const map = {
    Admin: ['posts:create','posts:read','posts:update','posts:delete','users:manage','roles:manage'],
    Editor: ['posts:create','posts:read','posts:update:own','posts:delete:own'],
    Viewer: ['posts:read']
  };
  const perms = map[user.role] || [];
  if (perms.includes(action)) return true;
  if (resource && perms.includes(`${action}:own`)) {
    return resource.authorId === user.id;
  }
  return false;
}
