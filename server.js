
/////////////////////////////////////
////Database requires////////////////////////
/////////////////////////////////////
const express = require("express"); // Express web server framework
const bodyParser = require("body-parser"); // Body parsing middleware
const pg = require("pg"); // PostgreSQL database client


/////////////////////////////////////
////sessie requires////////////////////////
/////////////////////////////////////

const bcrypt = require("bcrypt"); // Password hashing
const passport = require("passport"); // Authentication
const { Strategy } = require("passport-local"); // Local authentication strategy
const session = require("express-session"); // Session middleware
const rateLimit = require("express-rate-limit"); // Rate limiter middleware
const cookieParser = require('cookie-parser'); // Cookie parser middleware


/////////////////////////////////////
////General requires////////////////////////
/////////////////////////////////////
const env = require("dotenv"); //.env config files
const nodemailer = require('nodemailer');// mail systeem
const multer = require('multer'); //upload image
const flash = require('connect-flash'); //fout meldingen
const path = require('path'); // mappen path
const fs = require('fs'); // file system
const upload = multer({ dest: 'public/images/' }); //upload image
const jimp = require('jimp'); //resize image
const i18n = require('i18n'); //language
const PDFDocument = require('pdfkit');

const { check, validationResult } = require('express-validator');


require('dotenv').config();     //env config files






// Create a rate limiter middleware
const loginRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // Maximum number of requests allowed within the window
    message: "Too many login attempts. Please try again later.",
});






/////////////////////////////////////
/************* Check if dir exist and create if needed ************ */
/////////////////////////////////////
const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}


const app = express();
const port = 3000;
env.config();

app.use(
    session({
        secret: "TOPSECRETWORD",
        resave: false,
        saveUninitialized: true,
    })
);

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})


const pool = new pg.Pool({
    user: "world_j3vg_user",
    //host: "dpg-cojgia8cmk4c73bqv2mg-a",
    host: "dpg-cojgia8cmk4c73bqv2mg-a.frankfurt-postgres.render.com",
    database: "world_j3vg",
    password: "LuQNOF0WaL1Hw4LlydE1ZrDqMj24ZPfz",
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

/////////////////////////////////////
/************* Routes ************ */
/////////////////////////////////////
app.use(bodyParser.json());  // Parse JSON bodies (as sent by API clients)
app.use(express.json()); // Parse URL-encoded bodies (as sent by HTML forms)
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.static("public")); // Serve static files from the public directory
app.use('/views', express.static('views')); // Serve static files from the views directory
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory


app.use(passport.initialize()); // Initialize Passport
app.use(passport.session()); // Enable session support
app.use(flash()); // Enable flash messages
app.use(cookieParser()); // Enable cookie parsing




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies (as sent by HTML forms)



// parse application/json
app.use(bodyParser.json()); // Parse JSON bodies (as sent by API clients)



i18n.configure({ // Configure the i18n module
    locales: ['en', 'nl'], // The locales you support
    directory: __dirname + '/locales', // The directory where your locale files will be stored
    objectNotation: true, // This allows you to use nested JSON objects for your locale files
    cookie: 'language', // Set the cookie name to 'language'
    queryParameter: 'lang', // Set the query parameter name to 'lang'
    defaultLocale: 'nl', // Set the default locale to 'en'
});
// Middleware to load the language preference from the cookie


app.use(i18n.init); // Initialize the i18n module



// Define your language options globally
const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'nl', label: 'Dutch' }
];




/////////////////////////////////////
/************* COOKIES ************ */
/////////////////////////////////////


// Middleware to load the language preference from the cookie
app.use((req, res, next) => {
    const selectedLanguage = req.cookies.language; // Set the default language to English if not provided
    if (selectedLanguage) {
        req.setLocale(selectedLanguage);
    }
    next();
});













app.get("/", async (req, res) => {
    try {


        res.render('index.ejs'); 
    } catch (err) {
        console.error(err);
        res.status(500).send(req.__('errors.randomError'));
    }
});





app.get("/meerinfo", async (req, res) => {
    try {


        res.render('meerInfo.ejs');
    } catch (err) {
        console.error(err);
        res.status(500).send(req.__('errors.randomError'));
    }
});

























/////////////////////////////////////
/************** pasport *//////////
/////////////////////////////////////

passport.use(
    new Strategy(async function verify(email, password, cb) {
        try {
            const result = await pool.query("SELECT * FROM users WHERE email = $1 ", [
                email,
            ]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const storedHashedPassword = user.password;
                bcrypt.compare(password, storedHashedPassword, (err, valid) => {
                    if (err) {
                        //Error with password check
                        console.error("Error comparing passwords:", err);
                        return cb(err);
                    } else {
                        if (valid) {
                            //Passed password check
                            return cb(null, user);
                        } else {
                            //Did not pass password check
                            return cb(null, false);
                        }
                    }
                });
            } else {
                return cb("User not found");
            }
        } catch (err) {
            console.log(err);
        }
    })
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});
passport.deserializeUser((user, cb) => {
    cb(null, user);
});







/////////////////////////////////////
/************* SERVER ************ */
/////////////////////////////////////

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
