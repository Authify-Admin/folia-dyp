import { cookies } from 'next/headers';
import { userOperations } from './firestore';

const SESSION_COOKIE_NAME = 'session_token';
const ADMIN_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

// Simple session store (in production, use Redis or a database)
const sessions = new Map<string, { userId: string; createdAt: number }>();

export function generateSessionToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function createSession(userId: string): Promise<string> {
  const token = generateSessionToken();
  sessions.set(token, {
    userId,
    createdAt: Date.now(),
  });

  // Set HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_DURATION / 1000, // Convert to seconds
    path: '/',
  });

  return token;
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = sessions.get(token);

  if (!session) {
    return null;
  }

  // Check if session expired
  if (Date.now() - session.createdAt > ADMIN_SESSION_DURATION) {
    sessions.delete(token);
    return null;
  }

  return { userId: session.userId };
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    sessions.delete(token);
  }

  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await userOperations.getById(session.userId);
  return user;
}

export async function isAdmin(): Promise<boolean> {
  // The User schema has no role field — admin accounts live in the separate
  // 'admins' collection (see /api/admin/login). Cookie-session users are
  // therefore never admins.
  return false;
}
