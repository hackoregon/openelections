# Open Elections Project

We're back baby.

This is the main repo for the Open Elections project.

Check out our [wiki](https://github.com/hackoregon/openelections/wiki) for information.

## Getting Started

To get this repo running locally you need to have a few dependencies installed.

- Node.js: make sure you have node installed on your machine. You can install it here: https://nodejs.org/en/download/
- NVM: use the node version manager to make sure we're all using the same node version. Download it here: https://github.com/nvm-sh/nvm
- Docker: You'll need Docker to run the frontend, backend, database. etc. Setup Docker by visiting: https://docs.docker.com/install/

## Local Development

The frontend depends on the backend & database to be up and running in order to be worked on locally. If you want to have hot module reloading, during development you could use Docker with volumes, but starting the Docker services you need and running the node server separately, is likely simpler. Also checkout the [app](/api/Readme.md) and [api](/api/README.md) Readmes for more info. In general the following command will get all dependencies running with volumes in the foreground:

```bash
    docker-compose up # add '-d' if you don't want run Docker in detached mode in the background
```

If you don't want to see local console logs from all running containers, you can add the `-d` flag to run in detached mode. See the (Docker documentation)[https://docs.docker.com/engine/reference/run/#detached-vs-foreground] for more info.

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

You'll need a `GOOGLE_GIS_KEY` in order for addresses to be properly geocoded for the public data visualizations.

Pull all the Docker images by running:

```bash
    docker-compose pull
```

Build the Docker images by running:

```bash
    docker-compose build
```

Start application by running:

```bash
    docker-compose up
```

### Seeding the Database

We have a set of seed files located in models/seeds, to run them:

```bash
    docker-compose -f docker-compose-test.yml up
    docker-compose run --rm api npm run seed
```

### Testing

Use the following steps to run through the jest/mocha tests. You can see the what Travis, the CI/CD tool we are using, runs when a PR is opened against the `develop` branch in `./scripts/test.sh`.

> Heads up: Make sure after each test you clear the Docker containers (`docker-compose [-f docker-file-name.yaml] down`) or you will probably get `Error: Request failed with status code 403`.

##### 1. Install the app:

In the root directory run the following. Note: `-f docker-compose-test.yml` specifies the test Docker.

```bash
    docker-compose -f docker-compose-test.yml build
```

In the app directory, you'll have to install the app dependencies (outside of Docker)

```bash
    cd app
    yarn install
```

##### 2. Then you can run the api in Docker:

```bash
    docker-compose -f docker-compose-test.yml up api
```

##### 3. Run the Test Suites

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

##### Debugging Docker

If you're not sure how to solve a Docker issue, removing all created Docker containers usually is a good place to start:

```bash
    #The following command will return a list of container ids
    docker ps -a # yes docker, not docker-compose
    #Use each container id in the following command
    docker rm <container-id> -f # remove the container id
```

I also have experienced issues getting docker to build locally to test UI. Most recently I was getting these errors: `docker output clipped, log limit 1MiB reached` and `npm WARN tar ENOSPC: no space left on device, open`. I had to do the following:

```bash
docker system prune

DOCKER_BUILDKIT=0 docker-compose -f docker-compose-qa.yml up
```

If you are seeing pm2 errors when trying to spin up a production container, make the the pm2 version in the Dockerfile matches the node version in the Dockerfile.

## Deployment

This project uses Travis to Continuously deploy to qa.openelectionsportland.org on commits to develop.
When you open a PR, Travis will run our test suite, and mark it as passing or failing on the PR at Github.
When the PR is merged into develop, and the test suite is passing, Travis will deploy using scripts/deploy.sh
