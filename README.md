# Second-git-code

A simple website with a contact form that uses Formspree to send email without your own server.

## Setup

1. Sign up at https://formspree.io and create a new form.
2. Copy your form endpoint ID.
3. Open `index.html` and replace `YOUR_FORM_ID` in the form action with your Formspree ID.

Example:

```html
<form action="https://formspree.io/f/mayvlrpg" method="POST">
```

## How it works

- The contact form sends a POST request to Formspree.
- Formspree forwards the submission to your email.
- You do not need a custom backend server for this site.

## Notes

- Keep `index.html` updated with your correct Formspree form ID.
- Formspree also supports custom redirects and spam protection if you want to add them later.
