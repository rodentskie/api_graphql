'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class UserHobby extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserHobby.init(
        {
            UserId: DataTypes.INTEGER,
            HobbyId: DataTypes.INTEGER
        },
        {
            sequelize,
            modelName: 'UserHobby'
        }
    );
    return UserHobby;
};
