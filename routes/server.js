var express = require('express');
var bodyParser = require("body-parser");
var router = express.Router();
var jsonParser = bodyParser.json(); // ??????? ?????? ??? ?????? ? ??????? json
var pgp = require("pg-promise")();
var db = pgp("postgres://client:qwerty@localhost:1234/project");
var mydata = [1,2,3]
//JSON.parse(dataBD);


var time;
var speed;
var productivity;
var count;
var json = '{"speed":"0", "productivity":"0", "count":"0", "datetime": "0"}';
json = JSON.parse(json);



//queries to DB


router.get('/123', function(req, res, next) {

    if(!req.query) return res.sendStatus(400);
    else
    {
        db.many("select begin_date, end_date\n" +
            "from work_calendars\n" +
            "where descr != 'Working';")
            .then(function (data) {
                //console.log(JSON.stringify(data));
                time = data;
                time = JSON.stringify(time);
                time = JSON.parse(time);
                json.datetime = time;
                router.get('/testajax', function(req, res, next) {
                    res.send(JSON.stringify(json));
                });

            })
            .catch(function (error) {
                //response.write("ERROR");
                console.log("ERROR:", error);
            });

        db.many("select count(*) as v\n" +
            "from work_calendars\n" +
            "where descr != 'Working';")
            .then(function (data) {
                count = data;
                json.count = count[0].v;
                router.get('/testajax', function(req, res, next) {
                    res.send(JSON.stringify(json));
                });


            })
            .catch(function (error) {
                console.log("ERROR:", error);
            });
        db.many("select value from params join param_values " +
            "on params.param_id = param_values.param_id " +
            "where params.name = 'Max speed';")
            .then(function (data) {
                speed = data;
                json.speed = speed[0].value;
                router.get('/testajax', function(req, res, next) {
                    res.send(JSON.stringify(json));
                });

            })
            .catch(function (error) {
                console.log("ERROR:", error);
            });
        db.many("select value from params join param_values " +
            "on params.param_id = param_values.param_id " +
            "where params.name = 'Date production';")
            .then(function (data) {
                productivity = data;
                json.productivity = productivity[0].value;
                router.get('/testajax', function(req, res, next) {
                    res.send(JSON.stringify(json));
                });

            })
            .catch(function (error) {
                console.log("ERROR:", error);
            });

    }

});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/testajax', function(req, res, next) {
    res.send(JSON.stringify(json));
});

/*
    TIME PARSER

 while(i < count) {
            console.log("PAUSE TIME " + (i+1) + " (IN MINUTES)" );
            t = new Date(time[i].begin_date);
            begin_in_minutes = t.getHours()*60 + t.getMinutes();
            console.log(begin_in_minutes);
            t = new Date(time[i].end_date);
            end_in_minutes = t.getHours()*60 + t.getMinutes();
            if(end_in_minutes < begin_in_minutes) {     // åñëè end_time íà ñëåäóþùèé äåíü
              end_in_minutes += 24*60;
            }
            console.log(end_in_minutes);
            i++;
        }
 */






module.exports = router;
