const model = require("../models/event");

// 1. GET /events: Send all events to the user
exports.index = (req, res) => {
  res.render("./event/events", { events: model.find() });
};

// 2. GET /events/new: HTML form for creating a new event
exports.new = (req, res) => {
  res.render("./event/newEvent");
};

// 3. POST /stories: Create a event story
exports.create = (req, res) => {
  let event = req.body;

  model.save(event);
  res.redirect("/events");
};

// 4. GET /stories/:id Send event with specific id
exports.show = (req, res, next) => {
  let id = req.params.id;
  let event = model.findById(id);

  if (event) {
    res.render("./event/event", { event: event });
  } else {
    let err = new Error("Cannot find a event with id " + id);
    err.status = 404;
    next(err);
  }
};