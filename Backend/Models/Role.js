const models = require(".")
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        name: {
            type: DataTypes.STRING,
            allowNull : false,
            field: 'name',
            validate: {
                notEmpty : {msg: 'Role Name cannot be empty.'}
            }
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    },{
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        tableName: 'Roles',
    });

    Role.associate = function (models) {
        Role.hasMany(models.User, {
            foreignKey: 'roleId',
        });
    };
    return Role;
}