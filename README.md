## Getting Started

First, build and run the application:

```bash
npm run dev
```

The app will be available locally at http://localhost:3000.

To instantly expose your local server to the internet through a secure, temporary HTTPS URL without any port forwarding, run:

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Once executed, Cloudflare will generate a public URL in the terminal, for example:
https://some-random-words.trycloudflare.com

To test the application on other devices, simply open the generated link on your smartphone

## Deploy 
To deploy the application run the following command in the `main` branch:

```bash
npm run deploy
```
What the script does:
- Build the application
- Generates a static export of the project.
- Copies the exported files to the gh-pages branch.
- Pushes the updates to GitHub, which automatically triggers the deployment process.

## QR
Scan the following QRs to reach the webAR platform. Once the camera is active, scan again the QR to go to the AR effect.

<table>
  <tr>
    <td><img width="263" height="301" alt="IceCore" src="https://github.com/user-attachments/assets/17ac4c3a-7865-4382-ab4d-0e57ca7aca58" /></td>
    <td><img width="300" alt="Carota" src="https://github.com/user-attachments/assets/fc90b00c-dee0-4459-89cb-549f116391d3" /></td>
  </tr>
  
  <tr>
    <td><img width="262" height="302" alt="Glacier in Time" src="https://github.com/user-attachments/assets/6b2d45e1-078a-40ac-9b4b-b289b8b9a1d9" /></td>
    <td><img width="300" alt="Ieri e oggi" src="https://github.com/user-attachments/assets/7a442b75-e6cf-482a-a635-a6ba206604de" /></td>
  </tr>
</table>
