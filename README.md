# Vue Project - backend

- A task manager web application with relational database and authentication by user.  
- All tasks of a user are restricted to other users.  
- Respecting confidentiality.  

## Technologies

- NestJS
- PostgreSQL
- Docker

## Installation

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

To show routes: `localhost:3000/docs`.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Docker

```bash

docker-compose -f docker-compose.yml up

```

Note  
In backend folder.  
Not forget environment variables settings.  
A script bash was created for help this.  
Database is named after postgres as host.  

## License

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers.

Nest is [MIT licensed](LICENSE).

## Support

If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Docs

[Documentation NestJS](https://docs.nestjs.com)
