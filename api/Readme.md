## Open Elections API

### Installation

This project is a typescript node project. First, install 'nvm' a node version management at https://github.com/creationix/nvm/blob/master/README.md.

Next, install node:

```
cd openelections/api
nvm install
# this looks at the .nvmrc file and installs the correct version of node
```

Next, install the dependencies:

```
yarn 
#or 
npm install
```

Finally, boot up the development server:

```
npm run develop
```

We use TSlint to run linting. You can run linting and tests by running:

```
yarn test
#or 
npm test
```

### Testing

We're using fixutres from https://github.com/RobinCK/typeorm-fixtures located in the tests
