'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('UserHobbies', [
            {
                UserId: 1,
                HobbyId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                UserId: 1,
                HobbyId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                UserId: 2,
                HobbyId: 1,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('UserHobbies', null, {});
    }
};
