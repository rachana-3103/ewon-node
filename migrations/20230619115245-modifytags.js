"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("tags", "history", {
      type: Sequelize.JSON,
      defaultValue: [0],
      allowNull: true,
    }),
    queryInterface.addColumn("tags", "transaction_id", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("tags", "history");
    queryInterface.removeColumn("tags", "transaction_id");

  },
};
