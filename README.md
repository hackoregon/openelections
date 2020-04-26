# Open Elections Project

This is the master repo for the Open Elections project.

Check out our [wiki](https://github.com/hackoregon/openelections/wiki) for information.

## Getting Started
To get this repo running locally you need to have a few dependencies installed.
- Node.js: make sure you have node installed on your machine. You can install it here: https://nodejs.org/en/download/
- NVM: use the node version manager to make sure we're all using the same node version. Download it here: https://github.com/nvm-sh/nvm
- Docker: You'll need docker to run the frontend, backend, database. etc. Setup docker by visiting: https://docs.docker.com/install/


## Local Development

The frontend depends on the backend & database to be up and running in order to be worked on locally. If you want to have hot module reloading, during development you could use docker with volumes, but starting the docker services you need and running the node server separately, is likely simpler. Also checkout the [app](/api/Readme.md) and [api](/api/README.md) Readmes for more info. In general the following command will get all dependencies running with volumes:

```bash
    docker-compose up
```


You can use the following commands to get up and running for frontend development locally:

```bash
    # start the api and db
    docker-compose -f docker-compose-test.yml up api
    # then start the frontend serve
    cd app
    yarn start
```




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

### Debugging
If you encounter a particularly common or interesting issue, when trying to get the local environment working, feel free to add the problem / solution here.
##### Debugging docker
If you're not sure how to solve a docker issue, removing all created docker containers usually is a good place to start:

```bash
    #The following command will return a list of container ids
    docker ps -a # yes docker, not docker-compose
    #Use each container id in the following command
    docker rm <container-id> -f # remove the container id
```

## Deployment

This project uses Travis to Continuously deploy to qa.openelectionsportland.org on commits to develop. 
When you open a PR, Travis will run our test suite, and mark it as passing or failing on the PR at Github.
When the PR is merged into develop, and the test suite is passing, Travis will deploy using scripts/deploy.sh
