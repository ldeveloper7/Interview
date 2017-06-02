var fs = require('fs');
var json2csv = require('json2csv');
var newLine= "\r\n";
var fields = ['Date',
    'Name',
    'Email',
    'Phone',
    'Address',
    'Notice required before joining',
    'Have you interviewed by us before? ',
    'Percentage',
    'Technology',
    'Reference',
    'Have Experience',
    'Previous Company',
    'Current CTC',
    'Expected Salary',
    'Father Name',
    'Father Occupation',
    'Mother Name',
    'Mother Occupation',
    'Siblings1',
    'Siblings2',
    'Result',
    'Any Other Remarks',
    'Application Status'];
var fieldsName = ['date',
    'name',
    'email',
    'phone',
    'address',
    'noticeRequired',
    'isInterviewedBefore',
    'percentage',
    'technology',
    'reference',
    'isExperience',
    'previousCompany',
    'currentCTC',
    'expectedSalary',
    'fatherName',
    'fatherOccupation',
    'motherName',
    'motherOccupation',
    'siblings1',
    'siblings2',
    'result',
    'anyOtherRemarks',
    'status'];

var fileName='InterviewApproved.csv';
var adminPassword=["lanetteam1","lanetteam2","lanetteam3","lanetteam4"]

module.exports = function (app) {

    // create todo and send back all todos after creation
    app.post('/api/user', function (req, res) {
        console.log('BBBBBBBB', req.body);
        req.body.isExperience= req.body.isExperience && req.body.isExperience=='on' ? 'Yes':'No';
        req.body.noticeRequired= req.body.noticeRequired && req.body.noticeRequired=='on' ? 'Yes':'No';
        req.body.isInterviewedBefore= req.body.isInterviewedBefore && req.body.isInterviewedBefore=='on' ? 'Yes':'No';
        var toCsv = {
            data: req.body,
            fields: fieldsName,
            hasCSVColumnTitle: false
        };
        if (req.body.status == "Approved") {
          fileName = 'InterviewApproved.csv';
        } else {
          fileName ='InterviewDecline.csv';
        }
      fs.stat(fileName, function (err, stat) {
        if (err == null) {
          console.log('File exists');

          //write the actual data and end with newline
          var csv = json2csv(toCsv) + newLine;

          fs.appendFile(fileName, csv, function (err) {
            if (err) return res.send({success:false, err:err});
            return res.send({success:true});
            console.log('The "data to append" was appended to file!');
          });
        }
        else {
          //write the headers and newline
          console.log('New file, just writing headers');
          fields= (fields + newLine);

          fs.writeFile(fileName, fields, function (err, stat) {
            if (err) return res.send({success:false, err:err});
            console.log('file saved');
            var csv = json2csv(toCsv) + newLine;

            fs.appendFile(fileName, csv, function (err) {
              if (err) return res.send({success:false, err:err});
              console.log('The "data to append" was appended to file!');
              return res.send({success:true});
            });
          });
        }
      });



    });

    app.post('/api/admin', function(req, res){
        var password=req.body.password;
        return res.json({success:adminPassword.indexOf(password) > -1 ? true: false})
    });
    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
