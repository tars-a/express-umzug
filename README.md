# Express Umzug

This middleware creates a series of endpoints to help you monitor and manage your database migrations when it's pushed to production. It's useful when you run your application on Cloud Native Platforms such as Cloudfoundry, ElasticBeanstalk, AWS ECS, Nomad, Kubernetes, Openshift, Heroku etc. and you are in need of endpoints for administering schema migrations.

## Getting Started

It is based on [umzug](https://github.com/sequelize/umzug) by Sequelize.


## Endpoints 

| Endpoint ID | Description |
| ---- | ---- |
| GET `migrations/all` | Getting all migrations (Combining output of executed and pending) |
| GET `migrations/pending` | [Getting all pending migrations](https://github.com/sequelize/umzug#getting-all-pending-migrations) |
| GET `migrations/executed` | [Getting all executed migrations](https://github.com/sequelize/umzug#getting-all-executed-migrations) |
| POST `migrations/up`| [Executing pending migrations](https://github.com/sequelize/umzug#executing-pending-migrations) |
| POST `migrations/up/:id` | Executing pending migrations upto specific migration id |
| POST `migrations/up/step/:count` | Executing pending migrations up till pecific steps |
| POST `migrations/down` | [Reverting executed migration](https://github.com/sequelize/umzug#reverting-executed-migration) |
| POST `migrations/down/:id` | Reverting executed migrations down to specific migration id |
| POST `migrations/down/step/:count` | Reverting executed migrations down till specific steps |

### [Download Postman Collection](https://www.getpostman.com/collections/01292c6e030a12e71d49)

## Installing
```bash
npm i express-umzug
```

## Usage

Using express-umzug is really simple. You'd import it just as other packages, invoke the instance, and apply it as a middleware to your Express app instance. For example:

```javascript
const express = require("express");
const { expressUmzug, SequelizeStorage } = require("express-umzug");
const sequelize = require("./path/to/your/sequelize/instance"); // usually "./models/"
const { Sequelize } = require("sequelize");
const app = express();

app.use(expressUmzug({
  secretKey: "<your_secret_key>" // make sure not to share this key
  umzugOptions: {
    context: sequelize.getQueryInterface(), // required for express-umzug to work
    storage: new SequelizeStorage({ sequelize }), // your migration storage mechanism (you can check the source code to look at the available storage types)
    basePath: "/development", // you can change this to a custom base path of your choice (by default - an empty string i.e. no base path),
    migrations: {
      // change according to your migration path
      glob: "/migrations/*.js",
      // you'd need to pass down a function to `resolve` field which hijacks
      // the migrations and passes down the correct sequelize instance and the
      // Sequelize class. Expect it to break if you don't pass the function
      resolve: ({ name, path, context }) => {
        const migration = require(path);
        return {
          name,
          up: async () => migration.up(context, Sequelize),
          down: async () => migration.down(context, Sequelize),
        };
      }
    },
    logger: console // you can optionally pass a logger too
  },
}));

// rest of the code...

```
For express-umzug to work, the `options` argument requires a `secretKey` string to be passed in. You'd then add the same secret key in `x-secret-key` header of you request. This secret key is not supposed to be committed in the code. Keep it somewhere hidden. 
`options` also requires `umzugOptions` to be passed in. This is the options object that is intrinsically passed into [umzug](https://www.npmjs.com/package/umzug) constructor.

Currently, only the [sequelize](https://sequelize.org) ORM is supported.

Once set up, you can use any HTTP client (e.g. cURL, Postman, Insomnia, etc.) to access the endpoints to manage you migrations. Refer to [Endpoints](#endpoints) for all the available endpoints and their use cases. For example, hitting `migrations/all` endpoint will give you all the executed and pending migrations.
```bash
curl -H "x-secret-key: <your_secret_key>" https://example.com/migrations/all
```

## Running the tests

You can run the tests using `npm test` command:
```bash
npm test
```

To check the test coverage, execute:
```bash
jest --coverage
```
If you have [jest](https://jestjs.io/) globally installed on your system  
  
OR  
```bash
npx jest --coverage
```
If you don't have [jest](https://jestjs.io/) globally installed on your system

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

To be updated.

## Contributing

We currently don't allow other developers to contribute to this project. Once the project becomes more mature, we'll open the doors for contributions. Keep checking this space.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](). 

## Authors

* **Dishant Pandya** - *Initial work* - [Openxcell](openxcell.com)
* **Dhwanik Panchal** - *Initial work* - [Email](mailto:panchaldhwanik9j@gmail.com)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
