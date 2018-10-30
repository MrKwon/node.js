module.exports = (sequelize, DataTypes) => {
  return sequelize.define('comment', {
    comment: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('now()'),
    },
  }, {
    timestamps: false,
  });
};
