var express = require('express');
var mail = require("nodemailer").mail;
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/404');
});

app.get('/:checkup_id', function(request, response) {
    var checkup_id = request.params.checkup_id;
    response.render('pages/index', {checkup_id: checkup_id});
});

app.post('/email/:checkup_id', function(request, response) {
    var checkup_id = request.params.checkup_id;
    var content = request.body;
    var patientEmail = content.patientEmail,
        actions = content.actions,
        comments = content.comments,
        emailBodyHtml = "<p>Your doctor has recommended for you to do the following: </p><ul>";

    for (var i=0; i < actions.length; i++) {
        if (actions[i].selected) {
            emailBodyHtml += "<li>" + actions[i].action + "</li>";
        }
    }
    emailBodyHtml += "</ul>";
    if (comments) {
        emailBodyHtml += "<p>Additional comments: " + comments + "</p>";
    }

    mail({
        from: "doctor@example.com",
        to: patientEmail,
        subject: "Update on your most recent sole checkup",
        html: emailBodyHtml,
    });
    response.render('pages/index', {checkup_id: checkup_id});
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
