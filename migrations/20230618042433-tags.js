module.exports = {
    up: (queryInterface, Sequelize) =>
      queryInterface.createTable("tags", {
        id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        tag_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
        },
        ewon_id: {
          type: Sequelize.BIGINT,
          references: {
            model: "ewons",
            key: "id",
          },
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        data_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        alarm_hint: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        value: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        quality: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        alarm_state: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: [0] // Set a default empty array if desired
        },
        ewon_tag_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        alarm_history: {
          type: Sequelize.JSON,
          allowNull: true,
          defaultValue: [0] // Set a default empty array if desired
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
    down: (queryInterface) => {
      queryInterface.dropTable("tags");
    },
  };
  