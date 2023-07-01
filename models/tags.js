module.exports = (sequelize, DataTypes) => {
    const tags = sequelize.define("tags", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tag_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      ewon_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "ewons",
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      data_type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alarm_hint: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alarm_state: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [0] // Set a default empty array if desired
      },
      ewon_tag_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      alarm_history: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [0] // Set a default empty array if desired
      },
      history: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [0] // Set a default empty array if desired
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    return tags;
  };
  