function applyExtraSetup(sequelize) {
    const { users, roles, users_roles } = sequelize.models;

    // orchestra.hasMany(instrument);
    // instrument.belongsTo(orchestra);
    users.belongsToMany(roles, {
        through: users_roles,
        // as: 'userRoles',
        // foreignKey: users_roles.roleId,
    });
    roles.belongsToMany(users, {
        through: users_roles,
        // as: 'roleUsers',
        // foreignKey: users_roles.userId,
    });
}

module.exports = { applyExtraSetup };