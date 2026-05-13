import { Preferences } from '@capacitor/preferences';

// Single key used to persist the lightweight app session in Capacitor storage.
const AUTH_SESSION_KEY = 'aggregateai.auth.session';

export async function saveAuthSession(session) {
  // Store only the app-level user details we need outside Supabase internals.
  await Preferences.set({
    key: AUTH_SESSION_KEY,
    value: JSON.stringify(session)
  });
}

export async function getAuthSession() {
  // Read the saved session and deserialize it back into a plain object.
  const { value: rawSession } = await Preferences.get({
    key: AUTH_SESSION_KEY
  });

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch (error) {
    // Clear corrupted data so future reads can recover cleanly.
    console.error('Failed to parse auth session:', error);
    await Preferences.remove({ key: AUTH_SESSION_KEY });
    return null;
  }
}

export async function clearAuthSession() {
  // Remove the persisted app session during logout or auth reset flows.
  await Preferences.remove({ key: AUTH_SESSION_KEY });
}
