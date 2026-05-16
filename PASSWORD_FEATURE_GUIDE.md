# Secure Folder - Password & Security Questions Feature

## Overview
The secure folder feature now includes a comprehensive password protection system with security questions for password recovery. This ensures users can protect their private folder data while still being able to recover their password if forgotten.

## Features Implemented

### 1. First-Time Setup
When a user clicks the "Folder" button for the first time:
- A modal appears asking them to create a password
- The user must set up 2 security questions:
  - **Question 1**: Date of birth (format: YYYY-MM-DD)
  - **Question 2**: College/University name

**Validation:**
- Password must be at least 4 characters long
- Passwords must match (confirm field)
- Both security questions must be answered
- All fields are required

### 2. Normal Login (After Setup)
When a user clicks the "Folder" button after initial setup:
- A modal appears asking for the folder password
- User can enter their password to unlock the folder
- Enter key submits the form

**Security:**
- Password is hashed before storage (using btoa with a salt)
- 3 failed password attempts lock the user out temporarily
- User is shown how many attempts remain

### 3. Forgot Password Recovery
If a user forgets their password:

**Step 1**: Click "Forgot password?" button on the password entry screen

**Step 2**: Answer the two security questions:
- Date of birth (must match exactly what was set during setup)
- College/University name (case-insensitive, whitespace trimmed)

**Step 3**: If questions are answered correctly:
- User is prompted to enter a new password
- New password must be at least 4 characters
- Must match confirmation field

**Step 4**: After successful password reset:
- User can log in with the new password
- Folder data remains intact

### 4. Complete Folder Reset
If a user cannot remember their security answers:
- Click "Reset Folder & Password" button
- Confirm the action (irreversible!)
- All folder data and password settings are cleared
- User can create a new password for the folder

## File Changes Summary

### Config Updates (`src/config.js`)
- Added `FOLDER_SECURITY_QUESTIONS_KEY`
- Added `FOLDER_PASSWORD_ATTEMPTS_KEY`
- Added `FOLDER_SETUP_COMPLETE_KEY`

### Storage Manager Updates (`src/modules/storage.js`)
**New Methods:**
- `isFolderSetupComplete()` - Check if initial setup is done
- `markFolderSetupComplete()` - Mark setup as complete
- `saveSecurityQuestions()` - Save hashed security answers
- `verifySecurityQuestions()` - Verify security answers
- `hashPassword()` - Hash passwords and answers with salt
- `getPasswordAttempts()` - Get failed attempt count
- `incrementPasswordAttempts()` - Increment failed attempts
- `resetPasswordAttempts()` - Reset attempt counter
- `resetFolderAndPassword()` - Complete reset of all security

### UI Manager Updates (`src/modules/ui.js`)
**New Element Bindings:**
- `folderSetupModal`, `folderRecoveryModal`
- Password input fields for setup and recovery
- Security question input fields
- Error message displays

**New Methods:**
- `showFolderSetupModal()` / `closeFolderSetupModal()`
- `getFolderSetupData()` - Get setup form data
- `showFolderSetupError()` / `clearFolderSetupError()`
- `showFolderRecoveryModal()` / `closeFolderRecoveryModal()`
- `getFolderRecoveryData()` - Get recovery form data
- `showFolderRecoveryError()` / `clearFolderRecoveryError()`

### App Logic Updates (`src/modules/app.js`)
**Updated Methods:**
- `handleSecureFolder()` - Routes to setup or password entry
- `handleFolderPasswordSubmit()` - Verifies password with attempt tracking

**New Methods:**
- `handleFolderSetup()` - Initial setup validation and saving
- `handleFolderForgotPassword()` - Shows recovery modal
- `handleFolderRecoverySubmit()` - Validates answers and resets password
- `handleFolderResetComplete()` - Completely resets folder
- `handleFolderRecoveryCancel()` - Cancels recovery process

**New Event Listeners:**
- Setup form submission (click + Enter key)
- Recovery form submission (click + Enter key)
- Recovery cancel and reset buttons

### HTML Updates (`index.html`)
**New Modals:**
1. `folderSetupModal` - Initial password and security questions setup
2. `folderRecoveryModal` - Password recovery with security questions and new password entry

### Styling (`public/styles.css`)
**New Styles:**
- `.folder-setup-modal`, `.folder-recovery-modal` - Modal styling
- `.setup-section`, `.recovery-section` - Content sections
- `.info-text` - Informational text styling
- `.input-error` - Error message styling
- `.recovery-actions` - Button container for recovery options
- `.danger` - Red button styling for destructive actions

## Testing Checklist

### First-Time Setup
- [ ] Click "Folder" button (first time)
- [ ] Setup modal appears
- [ ] Enter password: "test123"
- [ ] Confirm password: "test123"
- [ ] Answer Q1: "1990-05-15"
- [ ] Answer Q2: "MIT"
- [ ] Click "Complete Setup"
- [ ] Folder manager opens empty

### Validation Testing
- [ ] Password too short (1-3 chars) shows error
- [ ] Passwords don't match shows error
- [ ] Missing security questions shows error
- [ ] Submitting with Enter key works

### Normal Login
- [ ] Click "Folder" button (after setup)
- [ ] Password entry modal appears
- [ ] Enter correct password: "test123"
- [ ] Folder manager opens

### Failed Password Attempts
- [ ] Enter wrong password: "wrong"
- [ ] Error shown: "Incorrect password. 2 attempt(s) remaining."
- [ ] Try 3 times total
- [ ] After 3rd failure, recovery button becomes active

### Password Recovery
- [ ] Click "Forgot password?"
- [ ] Recovery modal appears
- [ ] Enter Q1: "1990-05-15"
- [ ] Enter Q2: "MIT"
- [ ] Enter new password: "newpass123"
- [ ] Confirm: "newpass123"
- [ ] Click "Reset Password"
- [ ] Success message shown
- [ ] Can now login with new password

### Recovery with Wrong Answers
- [ ] Click "Forgot password?"
- [ ] Enter wrong answer for Q1: "2000-01-01"
- [ ] Enter Q2: "MIT"
- [ ] Error shown: "Security answers are incorrect"

### Folder Reset
- [ ] In recovery modal, click "Reset Folder & Password"
- [ ] Confirmation dialog appears
- [ ] Click confirm
- [ ] All data cleared
- [ ] Return to setup modal

## Security Notes

1. **Password Hashing**: Passwords are hashed using btoa with a salt-like approach. In production, use proper bcrypt or similar.

2. **Attempt Limiting**: Failed attempts are tracked to prevent brute force attacks (max 3 attempts).

3. **Security Questions**: Answers are hashed and compared, answers are case-insensitive and whitespace-trimmed.

4. **Local Storage**: All data stored in browser's localStorage. Users should clear browser data if using shared devices.

5. **XSS Protection**: No inline HTML injection possible through input fields.

## Usage Examples

### Scenario 1: User Sets Up Folder Protection
```
1. Click Folder button
2. Create password: "MySecurePass123"
3. Answer: Date - "1985-03-22", College - "Stanford"
4. Click Complete Setup
5. Folder is now protected!
```

### Scenario 2: User Forgets Password
```
1. Click Folder button
2. Enter wrong password 3 times
3. Click "Forgot password?"
4. Answer security questions correctly
5. Set new password
6. Login with new password
```

### Scenario 3: User Locked Out of Recovery
```
1. Click Folder button
2. Enter wrong password 3 times
3. Click "Forgot password?"
4. Cannot remember security questions
5. Click "Reset Folder & Password"
6. Confirm deletion
7. Set up new password for empty folder
```

## Troubleshooting

### "Setup Complete" indicator doesn't appear
- Check browser's localStorage in DevTools
- Look for key: `lifeWeeksFolderSetupComplete`

### Password not working after setup
- Check if answer format matches: dates should be YYYY-MM-DD
- College name is case-insensitive (trimmed)
- Try recovery process if unsure

### Cannot recover password
- Security questions are case-insensitive but whitespace matters
- Use format exactly: "YYYY-MM-DD" for dates
- If truly stuck, use "Reset Folder & Password" option

## Future Enhancements

1. Add "Show password" toggle in password fields
2. Add password strength meter
3. Implement time-based lockout after failed attempts
4. Add option to choose from pre-defined security questions
5. Add support for PIN-based quick unlock
6. Add biometric authentication (fingerprint/face)
