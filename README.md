# Open Elections Project

This is the master repo for the Open Elections project.

### Installation

#### Docker 

You'll need docker to get going. Setup docker by visiting: https://docs.docker.com/install/

### Commands

Pull all the docker images by running: 

```bash
    docker-compose pull
```
    
Start application by running:

```bash
    docker-compose up -d
```


### Seeding the Databse

We have a set of seed files located in models/seeds, to run them:

```bash
    docker-compose -f docker-compose-test.yml up -d
    docker-compose run --rm api npm run seed
```

### Testing

> Heads up: Make sure after each test you swipe the dockers or you will probably get `Error: Request failed with status code 403`.

1. In the root directory run the following. Note: `-f docker-compose-test.yml` specifies the test docker.
```bash
    docker-compose -f docker-compose-test.yml build
```

2. Then you can run the testdb:
```bash
    docker-compose -f docker-compose-test.yml up -d
```

3. Run the test suite:

```bash

    docker-compose -f docker-compose-test.yml run --rm api bash
    > npm test
    > npm test-watch
```
