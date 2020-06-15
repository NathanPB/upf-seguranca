const { Model, DataTypes } = require('sequelize');
const sha256 = require('crypto-js/sha256')

class User extends Model { }
class AuthToken extends Model { }

module.exports = (sequelize) => {
  User.init({
    email: DataTypes.STRING,
    pwd: DataTypes.STRING,
  }, { sequelize, modelName: 'user' })

  AuthToken.init({
    token: {
      type: DataTypes.STRING,
      defaultValue: () => String(sha256(`${+new Date()}${Math.random()}`))
    },
    expiration: {
      type: DataTypes.DATE,
      defaultValue: new Date(+new Date() + 600000)
    }
  }, { sequelize, modelName: 'token' })

  User.AuthToken = User.hasMany(AuthToken)

  return {
    User, AuthToken
  }
}
