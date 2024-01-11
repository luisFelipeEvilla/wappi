# Wappi

## Technologies

1. Nestjs 9
2. Type Scrip
3. Postgresql
4. TypeScript
5. TypeORM

## Setup

### Enviroment variables
first of all you need to create a `.env` file on the root directory or manually set enviromment variables. 

.env file example:

```
# Database connection info
DB_HOST=localhost
DB_NAME=postgres
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_SYNCHRONIZE=true  # Only use this on dev mode

# this come from your wompi account
WOMPI_PRIVATE_KEY=2929SKDKDK
WOMPI_PUBLIC_KEY=SJDJFHFH
WOMPI_INTEGRITY_SIGNATURE=SJDJFFJF

```

### Install dependencies
Run the following script on the command line from your project root directory to install all project dependencies

```bash
npm install
```


## Deployment

### Local/development enviroment
To start developing you only need to run the following script on the command line from your project directory
```bash
npm run start:dev
```

### Production
For production deployment you need to run the following script on your production server

>**_Note:__** Ensure to set DB_SYNCHRONIZE TO FALSE on your enviroment variables
```bash
npm run start
```

### Test
To run project run the following script

```bash
npm run test
```