## Open Elections API

### Installation

This project uses docker for testing and bootstrapping locally. 

First, download docker at http://docker.com and set it up.

Then, cd into the main open elections repo:

   ```bash
   docker-compose build api
   docker-compose up api
   #logs will show here
   ```
   
The project will be available via localhost:3000/

### Project Dependencies

- *Typescript* - The project is built and served using tsc and ts-node.
- *TypeOrm* - We use as our ORM to interact with Postgres
- *Amazon SES* - To send emails. In develop mode, all emails are logged to the console
- *Postgres* - All data is stored in Postgres. 
- *Redis* - Caching and PubSub is handled through redis 
- *JWT Token* - Project uses JWT Tokens for permissioning
- *Mocha & Chai* - Project uses Mocha and Chai

### Project Structure

```
openelections/
    api/
       controller/ - all route actions are placed here. name the file after the route. i.e. /api/users, would be users.ts
       models/ - location of all database abstractions
        entity/ - table abstraction model files
        seeds/ - seeds for development database
        db.ts - main typeorm connnection file
        redis.ts - exports the redis client
       routes/ - localtion of all app routes
        helpers - router middleware
        index.ts - setups up middleware on app, and master location of all routes
       services/ - location of all complex business logic     
       test/ - all test files
       types/ - any typescript types necessary
       app.ts - very simple express setup
       Dockerfile - production build 
       Dockerfile.development - used for development and test builds
       wait-for-it.sh - a script used to wait for port connections
```

### Conventions

- Controllers - All route paths are placed in controllers. If the name of the route path is /users, name the file users.ts. 
Each action inside the controller file should be the same as the second path. I.e. /users/invite -> users.ts#function invite. 

- Models - All table abstraction models are located in models/entities. The files should be uppercase (they export a class). 
Any types specific to the model data should be added to the file. Any complex joins and queries should be placed in the file. 
Do not place controller or service level objects into the file.

- Routes - All routes are located in routes/index.ts. Middleware on the app is applied in the routes/index.ts.
If a cookie session has 'token', its parsed and the request object has request.currentUser

- Services - All complex business logic effecting multiple models, permissions, etc are located here. 

- test - All test files/folders follow the top level directories. Note, controllers are not tested separately. They are tested via routes.
If test files get too long, create a new folder for the master test area, and smaller named files -> test/routes/users/invite.spec.ts
  
### Adding new libaries

If you need to add a new library via npm, you do so normally:

```bash
    npm install something --save-dev
```

Then, you will need to stop, rebuild and start the app.

```bash
    docker-compose stop api
    docker-compose build api
    docker-compose up api
```

### Testing

This project is coded with a TDD mindset. You can run the tests using our docker-compose travis file: 

```bash
   cd openelections
   docker-compose -f docker-compose-test.yml run api bash
   > npm test
```

If you would like to change code and run tests, first, uncomment out volumes in docker-compose-test.yml
```docer-compose-test.yml
#    volumes:
#      - ./api:/app
```

Do not commit that change, otherwise Travis will break.

Now, you can run tests


```bash
   cd openelections
   docker-compose -f docker-compose-test.yml run api bash
   > npm test
   # change file
   > npm test
```

To test one method or file, you can use testone:

```bash
   cd openelections
   docker-compose -f docker-compose-test.yml run api bash
   > npm testone tests/file/to/test.spec.ts
   # add testme to descriptor of test
   > npm testone tests/file/to/test.spec.ts -- -g testme #will the files' test for testme, and just test that one
```

If you need to see DB queries, update the models/db.ts file, setting the logging to true.

