const { Model, DataTypes } = require('sequelize');

class User extends Model { }
class AuthToken extends Model { }

module.exports = (sequelize) => {
  User.init({
    email: DataTypes.STRING,
    pwd: DataTypes.STRING,
  }, { sequelize, modelName: 'user' })

  AuthToken.init({
    token: DataTypes.STRING,
    expiration: {
      type: DataTypes.DATE,
      defaultValue: new Date(+new Date() + 600000)
    }
  }, { sequelize, modelName: 'token' })

  User.hasMany(AuthToken)

  return {
    User, AuthToken
  }
}
