module.exports = (app) => {
  const events = require("../controllers/event.controller.js");

  var router = require("express").Router();

  // Create a new event
  router.post("/", events.create);

  // Retrieve all Events
  router.get("/", events.findAll);

  // Update a event with id
  router.put("/:id", events.update);

  // Delete a event with id
  router.delete("/:id", events.delete);

  app.use("/api/events", router);
};
