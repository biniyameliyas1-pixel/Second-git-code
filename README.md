# Second-git-code

This project is a simple website with a contact form that sends email through a Node.js backend.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root.
   Copy values from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your email credentials:
   ```text
   EMAIL_USER=biniyameliyas1@gmail.com
   EMAIL_PASS=your_gmail_app_password
   PORT=3001
   ```

## Run

Start the server:

```bash
npm start
```

Then open:

- `http://localhost:3001`

## How it works

- `index.html` contains the contact form.
- `script.js` sends the form data to `POST /send-email`.
- `server.js` uses Express and Nodemailer to send the email.

## Notes

- Use a Gmail App Password for `EMAIL_PASS`.
- To create one, go to your Google Account > Security > App passwords, then generate a password for this app and copy it into `.env`.
- Do not commit `.env` to Git because it contains secrets.
