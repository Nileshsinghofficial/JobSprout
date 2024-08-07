const { DataTypes } = require('sequelize');
const sequelize = require('../config/ds'); // Adjust the path as needed

const Token = sequelize.define('Token', {
    token: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'tokens',
    timestamps: false // Optional: If you don't want Sequelize to manage createdAt/updatedAt fields
});

// Synchronize the model with the database
Token.sync()
    .then(() => console.log('Tokens table is ready.'))
    .catch(err => console.error('Error creating tokens table:', err));

module.exports = Token;
