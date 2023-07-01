module.exports = {
  up: (queryInterface, Sequelize) =>
  queryInterface.createTable("ewons", {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.BIGINT,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          lastSynchroDate: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          transaction_id: {
            type: Sequelize.BIGINT,
            allowNull: true,
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
    queryInterface.dropTable("ewons");
  },
};
