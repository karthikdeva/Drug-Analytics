var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var api = express.Router();


app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
})

api.get('/', (req, res) => {
    res.send('Welcome to Drug Analytics API page');
})

api.get("/drugs", (req, res) => {
    var drugs;
    fs.readFile('./drugs.json', function(err, content) {
        if (err) throw err;
        drugs = JSON.parse(content);
        res.send(drugs)
    });
});

api.get("/patients", (req, res) => {
    var patients;
    fs.readFile('./api/patients.json', function(err, content) {
        if (err) throw err;
        patients = JSON.parse(content);
        res.send(patients)
    });
});


api.get("/register", (req, res) => {
    var drug = {
        name: "abc",
        id: 123
    };
    generateUsers(drug);
    res.json("registered");
});

function generateUsers(drug) {
    fs.writeFile("./drugs.json", JSON.stringify(drug, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
}


app.use("/api", api);
app.listen(8484);
console.log("Server listening on 8484");