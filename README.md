# Simple Cookie Script
### A simple, custom cookie handler for third party cookies.

---

**Requirements**: `jQuery`

#### Usage

* add this script before `</body>` tag, and depends on your path with the `src` attribute
```html
<script type="text/javascript" src="js/simple-cookie-script/cookie-script.js"></script>
```
* on your scripts section, before `</body>` with the third party snippets
 - replace `type="text/javascript"` to `type="text/plain"` and add `data-cookiescript="google_trans"` retain `src` attribute value as is, (e.g.)
 - from
```html
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```
 - to
```html
<script type="text/plain" data-cookiescript="google_trans" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
```
**Note:** `data-cookiescript="google_trans"` value should be related to script

* on `cookie-script.js`
 - modified `cookieServices` variable
 - add property for your third party plugins that creates cookies
 - **Example:**
```js
myCustomThirdPartyPlugin: {
    action: function(status) {
      handleCookies('devs_custom_cookie-value', status, 'cookie_created-from-third-party');
    },
    cookieName: 'devs_custom_cookie-value',
    description: 'Brief description about this third party plugin.',
    enable: true,
    name: 'Third Party Name'
  },
```
 - `cookieName` key should be the value that you set on `data-cookiescript` from scripts section
 - on `action` key, `first parameter` should also like `cookieName` value and the `third or last parameter` will be the cookie created by the third party cookie.
 - `enable` key should be `true` if this cookie can be control by the user.
 - you can add allowed cookies which cannot be control by the user, just follow the below property snippet's structure.
 - **Example:**
```js
allowedCookieKey: {
    action: function() {
      handleCookies('allowed', null, null);
    },
    cookieName: 'allowed',
    description: 'This cookie is always allowed',
    enable: false,
    name: 'allowedCookieName'
  },
```
 - the `enable` key should be `false`, `handleCookies('allowed', null, null)` and `cookieName: 'allowed'` will be default for this property

* on `function cookieBar()`
 - edit the href value depends on the link of your cookie policy page.

* editing styles
 - you can modify styles on `style.css`

---


**Reference:**

- tarteaucitron: [External Link](https://opt-out.ferank.eu/en/)
- cookie script: [External Link](https://cookie-script.com/)
