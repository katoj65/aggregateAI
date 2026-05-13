import { Preferences } from '@capacitor/preferences';

const ROLE_SESSION_KEY = 'aggregateai.role.session';

export async function saveRoleSession(role) {
  await Preferences.set({
    key: ROLE_SESSION_KEY,
    value: role
  });
}

export async function getRoleSession() {
  const { value } = await Preferences.get({ key: ROLE_SESSION_KEY });
  return value ?? null;
}

export async function clearRoleSession() {
  await Preferences.remove({ key: ROLE_SESSION_KEY });
}
