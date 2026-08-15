import { loadUsers } from '@/lib/api';
import {
  UsersView,
  type TenantUser,
} from '@/components/users/users-view';

export default async function UsersPage() {
  let users: TenantUser[] = [];
  try {
    users = await loadUsers();
  } catch {
    users = [];
  }

  return <UsersView users={users} />;
}
