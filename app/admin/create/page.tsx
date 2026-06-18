'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Field, Input } from '@/components/admin/ui';

export default function CreateAdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create admin account');
        setLoading(false);
        return;
      }

      setSuccess(`Admin account created successfully! Username: ${username}`);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    } catch (error) {
      console.error('Error creating admin:', error);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Folia" width={120} height={40} className="h-9 w-auto" priority />
          <p className="mt-4 text-sm text-slate-500">Create a new admin account</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                {success}
              </div>
            )}

            <Field label="Username" htmlFor="username">
              <Input
                id="username"
                type="text"
                placeholder="Min 3 characters"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              hint="Min 8 chars with uppercase, lowercase, and number"
            >
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Field label="Confirm password" htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Field>

            <Button type="submit" loading={loading} className="w-full">
              {loading ? 'Creating…' : 'Create admin account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin" className="text-sm font-medium text-green-600 hover:text-green-700">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
