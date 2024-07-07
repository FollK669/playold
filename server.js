/////////////////////////////////////
////Database requires////////////////////////
/////////////////////////////////////
const express = require("express"); // Express web server framework
const bodyParser = require("body-parser"); // Body parsing middleware


const app = express();
const port = 3000;


/////////////////////////////////////
app.use(bodyParser.json());  // Parse JSON bodies (as sent by API clients)
app.use(express.json()); // Parse URL-encoded bodies (as sent by HTML forms)
app.set('view engine', 'ejs'); // Set the view engine to EJS
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.static("public")); // Serve static files from the public directory
app.use('/views', express.static('views')); // Serve static files from the views directory
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads directory

















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
/************* SERVER ************ */
/////////////////////////////////////

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
