import React from 'react';
import { can } from '../utils/permissions';
export default function GatedButton({ user, action, resource, onClick, children }) {
  const allowed = can(user, action, resource);
  return (
    <button onClick={allowed ? onClick : undefined} disabled={!allowed} title={!allowed ? 'Insufficient permissions' : ''}>
      {children}
    </button>
  );
}
