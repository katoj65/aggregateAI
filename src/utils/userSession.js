import { Preferences } from '@capacitor/preferences';

const USER_SESSION_KEY = 'aggregateai.user.session';

export async function saveUserSession(userId) {
  await Preferences.set({
    key: USER_SESSION_KEY,
    value: JSON.stringify(userId)
  });
}

export async function getUserSession() {
  const { value: rawUserId } = await Preferences.get({
    key: USER_SESSION_KEY
  });

  if (!rawUserId) {
    return null;
  }

  try {
    return JSON.parse(rawUserId);
  } catch (error) {
    console.error('Failed to parse user session:', error);
    await Preferences.remove({ key: USER_SESSION_KEY });
    return null;
  }
}

export async function clearUserSession() {
  await Preferences.remove({ key: USER_SESSION_KEY });
}
