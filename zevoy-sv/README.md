# Zevoy Assigment Backend

I built a simple server for the test. Due to it being an MVP I didn't adhere to the proper architecture patterns like MVC or Repository pattern

## Usage

### Enviroment

Copy `.env.example` to `.env` and change configure.

### Development

Run seed data postgres for development

```bash
node scripts/seed.mjs
```

```bash
# development server with hot reload nodemon
$ npm run dev

# Format with prettier
$ npm run format
```

### Production

```bash
# build for production
$ npm run build

# start production app
$ npm run start
```
