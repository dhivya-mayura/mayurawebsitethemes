# Style Haven

A clean responsive fashion e-commerce website.

## Files

- `index.html` - Homepage
- `products.html` - Product listing page
- `product.html` - Product details page
- `wishlist.html` - Wishlist page
- `login.html` - Admin login page
- `admin.html` - Admin dashboard demo

## Folders

- `css/style.css` - Main stylesheet
- `js/config.js` - Store settings
- `js/script.js` - Main website JavaScript
- `js/product.js` - Product detail JavaScript
- `js/admin.js` - Admin dashboard demo JavaScript
- `js/firebase.js` - Firebase setup placeholder
- `images/` - Add local images here
- `data/` - Future product JSON files

## Edit WhatsApp Number

Open:

```text
js/config.js
```

Change:

```javascript
whatsapp: "919999999999"
```

Use international format without `+`, spaces, or dashes.

## Admin Login

Current admin login is demo-only. Any email and password will work and products are stored in `localStorage`.

For production, connect `js/firebase.js` with Firebase Authentication and Firestore.

## GitHub Pages

Upload the full folder contents to your GitHub repository and enable GitHub Pages from the repository settings.
