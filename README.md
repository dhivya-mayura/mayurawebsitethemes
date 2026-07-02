# Style Haven - Clean Firebase-First Version

Upload all files directly to your GitHub repository root.

## Important

This version has no hardcoded product array. Products load only from Firebase Firestore.

## Files

- index.html
- products.html
- product.html
- wishlist.html
- login.html
- admin.html
- style.css
- config.js
- firebase.js
- script.js
- product.js
- admin.js

## Firebase setup

1. Firebase Console → Authentication → Sign-in method
2. Enable Email/Password
3. Authentication → Users → Add user
4. Use that email/password on login.html
5. Firestore Database → Create database
6. Use the rules below while testing

## Firestore rules for testing

```text
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Firestore collection

Products are saved in:

```text
products
```

## Product fields

```text
name
category
price
image
images
short
description
fabric
sizes
colors
stock
featured
createdAt
updatedAt
```

## Edit WhatsApp number

Open config.js and change:

```js
whatsapp: "919999999999"
```

Use international format, no + sign.

## How to verify

Open browser console and test:

```js
window.firebaseApp
window.firebaseDb
```

Both should return objects.
