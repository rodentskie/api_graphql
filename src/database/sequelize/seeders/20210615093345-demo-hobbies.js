'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Hobbies', [
            {
                name: `Playing Computer Games`,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: `Playing Sports`,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: `Sleeping`,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Hobbies', null, {});
    }
};
