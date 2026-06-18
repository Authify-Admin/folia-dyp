# Admin Panel Setup Guide

## Creating a Secure Admin Account

This guide will help you create a secure admin account with hashed password storage in Firestore.

### Prerequisites

1. Make sure your Firebase configuration is properly set up in `.env`
2. Ensure all environment variables are loaded

### Create Admin Account

Run the following command in your terminal:

```bash
npm run create-admin
```

You will be prompted to enter:
- **Username**: Minimum 3 characters
- **Password**: Must meet these requirements:
  - At least 8 characters long
  - Contains at least one uppercase letter (A-Z)
  - Contains at least one lowercase letter (a-z)
  - Contains at least one number (0-9)
- **Confirm Password**: Must match the password

### Example

```bash
$ npm run create-admin

🔐 Admin Account Setup

This script will create a secure admin account in Firestore.

Enter admin username: admin
Enter admin password (min 8 chars, must include uppercase, lowercase, and number): Admin123
Confirm password: Admin123

⏳ Creating admin account...

✅ Admin account created successfully!
Username: admin

🔒 Password has been securely hashed and stored in Firestore.
You can now login at /admin with these credentials.
```

### Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
2. **Firestore Security Rules**: The `admins` collection has restricted write access
3. **API Authentication**: The login API verifies credentials securely
4. **Session Management**: Admin sessions are stored in sessionStorage
5. **No Password Exposure**: Passwords are never logged or exposed in responses

### Login to Admin Panel

After creating your admin account:

1. Navigate to `/admin` in your browser
2. Enter your username and password
3. You'll be redirected to the admin dashboard upon successful login

### Firestore Structure

The admin document in Firestore contains:
```json
{
  "username": "admin",
  "password": "$2a$10$...", // bcrypt hashed password
  "role": "admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z"
}
```

### Troubleshooting

**Error: "An admin with this username already exists"**
- Choose a different username or delete the existing admin from Firestore

**Error: Firebase connection issues**
- Check your `.env` file has all required Firebase configuration
- Verify your Firebase project is active

**Error: Permission denied**
- Deploy the updated Firestore rules using: `firebase deploy --only firestore:rules`

### Resetting Admin Password

To reset an admin password:
1. Delete the admin document from the Firestore `admins` collection
2. Run `npm run create-admin` again with the same username

### Production Considerations

For production environments:
1. Use environment variables for the initial admin credentials
2. Implement rate limiting on the login endpoint
3. Add 2FA (Two-Factor Authentication) for enhanced security
4. Set up monitoring for failed login attempts
5. Consider using Firebase Admin SDK for server-side operations
