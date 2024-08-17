const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sequelize = require("./config/connection");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// Handlebars.js engine helpers
const hbs = 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// hanlebars.js template engine code

// sessions code

app.use(express.static('public'));

app.use(require('./controllers/'));

sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App is listening on port ${PORT}!`));
});