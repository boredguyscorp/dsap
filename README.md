## Install packages

```shell
npm i
```

### Setup .env file

````js
NEXT_PUBLIC_APP_URL=
NEXTAUTH_URL=
NEXT_PUBLIC_VERCEL_ENV=
DATABASE_URL=


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
