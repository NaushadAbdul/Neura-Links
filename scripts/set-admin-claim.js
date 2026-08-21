/**
 * Firebase Custom Claims Admin Script
 * 
 * Usage:
 * 1. Download your Firebase Service Account JSON key from:
 *    Firebase Console -> Project Settings -> Service Accounts -> Generate New Private Key
 * 2. Save the key as `serviceAccountKey.json` in the root directory.
 * 3. Run:
 *    node scripts/set-admin-claim.js <user-email-or-uid>
 * 
 * Example:
 *    node scripts/set-admin-claim.js naushadabdul2006@gmail.com
 *    node scripts/set-admin-claim.js admin@neuralinks.club
 */

const fs = require('fs');
const path = require('path');

let admin;
try {
  admin = require('firebase-admin');
} catch (e) {
  console.log("Installing firebase-admin module...");
  console.log("Please run: npm install firebase-admin");
  process.exit(1);
}

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ Error: serviceAccountKey.json not found in root project directory!");
  console.error("Please place your Firebase service account key file at:", serviceAccountPath);
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const targetIdentifier = process.argv[2];

if (!targetIdentifier) {
  console.log("Usage: node scripts/set-admin-claim.js <user-email-or-uid>");
  process.exit(1);
}

async function setAdminClaim(identifier) {
  try {
    let user;
    if (identifier.includes('@')) {
      user = await admin.auth().getUserByEmail(identifier.trim().toLowerCase());
    } else {
      user = await admin.auth().getUser(identifier.trim());
    }

    console.log(`Found user: ${user.displayName || 'No Name'} (${user.email}) - UID: ${user.uid}`);
    
    // Set Custom User Claim { admin: true }
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    
    console.log(`✅ Success! Custom claim { admin: true } granted to ${user.email} (${user.uid})`);
    console.log("Note: The user must sign out & sign back in, or call getIdTokenResult(true) to reflect updated claims.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting custom claim:", error.message || error);
    process.exit(1);
  }
}

setAdminClaim(targetIdentifier);
