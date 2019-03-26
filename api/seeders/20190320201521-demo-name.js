'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
        username: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        password: 'lksafdljksd',
        email: 'test@email.com',
        createdAt : new Date(),
        updatedAt : new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
