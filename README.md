## Install packages

```shell
npm i
```

### Setup .env file

````js
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_VERCEL_ENV=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
DATABASE_URL=
NODEMAILER_PW=
NODEMAILER_EMAIL_RECEIVER=
NODEMAILER_EMAIL=
SHOW_BANNER=
NEXT_PUBLIC_SHOW_BANNER=
SHOW_REGISTRATION=
NEXT_PUBLIC_SHOW_REGISTRATION=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
OPENAI_API_KEY=
GOOGLE_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
BG_API_SERVICE_KEY=
API_KEY_SIGNATURE_SECRET=
API_KEY_IGNORE_EXPIRATION=
NEXT_PUBLIC_OTP_SECRET_KEY=

### Connect to PlanetScale and Push Prisma

```shell
npx prisma generate
npx prisma db push
````

### Start the app

```shell
npm run dev
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
