
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var fs = require('fs');
var api = express.Router();

//Getting all the adverse effects
var adverseEffects = null;
fs.readFile('./api/adverse.json', function(err, content) {
    if (err) throw err;
    adverseEffects = JSON.parse(content);
});

function getMedications(settings,callback){
    var medications;
    fs.readFile('./api/medication.json', function(err, content) {
        if (err) throw err;
        medications = JSON.parse(content).filter(function(medication){
            if(medication.patientId == settings.patientId){
                if(settings.startDate && settings.endDate){
                    var medDateTime = new Date(medication.endDate).getTime();
                    var todaysDate = new Date(settings.startDate);
                    var numberOfDaysToSubtract = 60;
                    var startTime = todaysDate.setDate(todaysDate.getDate() - numberOfDaysToSubtract); 
                    // var startTime = new Date(settings.startDate).getTime();
                    var endTime = new Date(settings.endDate).getTime();
                    return ((medDateTime >= startTime) || 
                    (medDateTime >= startTime && medDateTime <=  endTime));
                }
                return true;
            }
            return false;
        });
        callback(medications);
    });
}

function writeMedications(data,callback){
    var medications;
    fs.readFile('./api/medication.json', function(err, content) {
        if (err) throw err;
        medications = JSON.parse(content);
        medications.push(data);
       var json = JSON.stringify(medications); //convert it back to json
        fs.writeFile('./api/medication.json', json, 'utf8', callback);
    });
}

function checkAdverseEffects(drugId, medications,callback){
    var adverse;
    var results = [];
    if(medications && medications.length){
        for(var i=0;i<medications.length;i++){
            var ads = adverseEffects[medications[i].normId];
            if(ads && ads.length){
                for(var k=0;k<ads.length;k++){
                    if(ads[k].normId == drugId){
                        results.push(ads[k].message);
                    }
                }
            }
        }
    }
    if(!results.length){
        results.push("Medication is added successfully!!");
    }
    callback(results);
}
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
api.get('/', (req, res) => {
    res.send('Welcome to Drug Analytics API page');
})

api.get("/drugs", (req, res) => {
    var drugs;
    fs.readFile('./api/drugs.json', function(err, content) {
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
api.get("/adverse/:normId", (req, res) => {
    var patients;
    fs.readFile('./api/adverse.json', function(err, content) {
        if (err) throw err;
        patients = JSON.parse(content);
        res.send(patients)
    });
});

api.get("/patients/:id/medication", (req, res) => {
    getMedications({"patientId":req.params.id},function(content){
        res.send(content);
    })
    /*var medications;
    fs.readFile('./api/medication.json', function(err, content) {
        if (err) throw err;
        medications = JSON.parse(content).filter(function(medication){
            return medication.patientId == req.params.id;
        });
        res.send(medications)
    });*/
});

api.post('/savemedication', function(req, res){
    
    res.setHeader('Content-Type', 'application/json');
    var medications = getMedications({"patientId":req.body.id,"startDate":req.body.startDate,"endDate":req.body.endDate},function(content){
        checkAdverseEffects(req.body.drugId,content,function(result){
         res.send(JSON.stringify({
            results: result || null
        }));
    }); 
    
    })
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