module.exports = (sequelize, DataTypes) => {
    const ewons = sequelize.define("ewons", {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      lastSynchroDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return ewons;
  };
  