const regexModule = require("../Modules/RegexModule");
const passwordModule = require("../Modules/PasswordModule");
//const converter = require("../Modules/turkishToEnglish")
const models = require(".");
const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstName: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'firstName',
            validate: {
                notEmpty: {msg: 'User firstName cannot be empty.'}
            }
        },
        middleName: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'middleName',
            validate: {
                notEmpty: {msg: 'User middleName cannot be empty.'}
            }
        },
        lastName: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'lastName',
            validate: {
                notEmpty: {msg: 'User lastName cannot be empty.'}
            }
        },
        username: {
            type: DataTypes.STRING,
            field: 'username'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: 'Password cannot be empty.'},
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            },
            field: 'email'
        },
        phone1: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: 'Phone cannot be empty.'},
            }
        },
        phone2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        adress: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        district: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        province: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        postalCode: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'postalCode'
        },
        preferredLanguage: {
            type: DataTypes.STRING,
            field: 'preferredLanguage',
            defaultValue: "tr",
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        lastLogin: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'lastLogin'
        },
        registeredAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'registeredAt',
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        roleId: {
            field: 'roleId',
            type: DataTypes.INTEGER
        },
        recoveryCode: {
            type: DataTypes.STRING,
            field: "recoveryCode",
            allowNull: true,
            defaultValue: null
        }
    }, {
        hooks: {
            beforeCreate: async (user) => {
                try {
                    user.password = await passwordModule.scrypt(user.password);
                } catch (err) {
                    console.log(err.message);
                    throw {message: 'Encryption Error.'};
                }
            }
        },
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        tableName: 'Users',
        indexes: [
            {unique:true, fields:['email']},
            {unique:true, fields:['phone1']},
            {unique:true, fields:['username']}
        ]
    });
    User.associate = function (models) {
        User.belongsTo(models.Role, {
            foreignKey: 'roleId',
            targetKey: 'id'
        });
    };

    User.ValidateCustom = async (user) => {
                // firstName Validation
        return  true;/*regexModule.checkLengthAtLeast(user.firstName, 2) &&
                regexModule.doesNotContainsAnySpecialChar(user.firstName) &&
                // lastName Validation
                regexModule.checkLengthAtLeast(user.lastName, 2) &&
                regexModule.doesNotContainsAnySpecialChar(user.lastName) &&
                // middleName Validation if exists else pass true
                (user.middleName ? regexModule.doesNotContainsAnySpecialChar(user.middleName) : true) &&
                regexModule.checkLengthAtLeast(user.password, 8) &&
                regexModule.hasAnyWhiteSpaces(user.password) &&
                // email Validation
                regexModule.isEmail(user.email) //&&
                // phoneNumber verification
                //regexModule.isValidPhoneNumber(user.phonePrefix, user.phoneNumber)*/
    };
    return User;
};