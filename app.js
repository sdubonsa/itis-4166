// 1. Require Modules
const express = require("express");
const eventRoutes = require("./routes/eventRoutes");
const mainRoutes = require("./routes/mainRoutes");
const methodOVerride = require("method-override");
const path = require("path");
const multer = require("multer");

// 2. Create application
const app = express();

// 3. Configure
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");

// 4. Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOVerride("_method"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const mimeTypes = ["image/jpeg", "image/png", "image/gif"];

  if (mimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only jpeg, jpg, png and gif image files are allowed."
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: fileFilter,
}).single("image");

exports.fileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      err.status = 400;
      next(err);
    } else {
      next();
    }
  });
};

// 5. Set-up routes
app.use("/", mainRoutes);

app.use("/events", eventRoutes);

app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render("error", { error: err });
});

// 6. Start the server
app.listen(port, host, () => {
  console.log("The server is running on port ", port);
});
