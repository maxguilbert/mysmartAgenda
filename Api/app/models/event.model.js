module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("event", {
    name: {
      type: Sequelize.STRING,
    },
    details: {
      type: Sequelize.STRING,
    },
    start: {
      type: Sequelize.STRING,
    },
    end: {
      type: Sequelize.STRING,
    },
    color: {
      type: Sequelize.STRING,
    },
  });

  return Event;
};
