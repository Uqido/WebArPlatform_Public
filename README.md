## Getting Started

First, build and run the application:

```bash
npm run build
npm run start
```

The app will be available locally at http://localhost:3000.

To instantly expose your local server to the internet through a secure, temporary HTTPS URL without any port forwarding, run:

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Once executed, Cloudflare will generate a public URL in the terminal, for example:
https://some-random-words.trycloudflare.com

To test the application on other devices, simply open the generated link on your smartphone
