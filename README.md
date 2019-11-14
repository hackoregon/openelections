# Open Elections Project

This is the master repo for the Open Elections project.

Check out our [wiki](https://github.com/hackoregon/openelections/wiki) for information.

### Installation

#### Docker 

You'll need docker to get going. Setup docker by visiting: https://docs.docker.com/install/

### Commands
If you're starting from scratch, you'll need to create a .env file
```bash
    touch .env
```

Pull all the docker images by running: 

```bash
    docker-compose pull
```
    
Start application by running:

```bash
    docker-compose up -d
```


### Seeding the Database

We have a set of seed files located in models/seeds, to run them:

```bash
    docker-compose -f docker-compose-test.yml up -d
    docker-compose run --rm api npm run seed
```

### Testing

> Heads up: Make sure after each test you swipe the dockers or you will probably get `Error: Request failed with status code 403`.

##### Install the app:

In the root directory run the following. Note: `-f docker-compose-test.yml` specifies the test docker.
```bash
    docker-compose -f docker-compose-test.yml build
```

In the app directory, you'll have to install the app dependencies (outside of docker)

```bash
    cd app
    yarn install
```

##### Then you can run the api in docker:
```bash
    docker-compose -f docker-compose-test.yml up api
```

##### Run the Test Suites

Run the api test suite:

```bash
    docker-compose -f docker-compose-test.yml run --rm api npm test
```

Run the app test suite:

```bash
    docker-compose -f docker-compose-test.yml run --rm app yarn test
```

Run the datascience api test suite:

```bash
    docker-compose -f docker-compose-test.yml run --rm data make test
```


### Deployment

This project uses Travis to Continuously deploy to qa.openelectionsportland.org on commits to develop. 
When you open a PR, Travis will run our test suite, and mark it as passing or failing on the PR at Github.
When the PR is merged into develop, and the test suite is passing, Travis will deploy using scripts/deploy.sh
