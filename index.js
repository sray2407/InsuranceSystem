const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const hbs = require('hbs');
const path = require('path');

app.use(bodyparser.json());

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');

app.use(bodyparser.urlencoded({ extended: false }));
//set public folder as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'InsuaranceDB'
    
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});


app.listen(3000, () => console.log('Express server is runnig at port no : 3000'));

app.get('/', (req, res) => {
    mysqlConnection.query('SELECT * FROM policyOwner', (err, rows, fields) => {
        if (!err)
         res.render('policy_view',{
         results: rows
          });
            //console.log(rows);
        else
            console.log(err);
    })
});

app.post('/policy', (req, res) => {
    console.log(req.body.opt)
    mysqlConnection.query("SELECT * FROM policyOwner where insuranceCmpy = '"+ req.body.opt +"'" +
    " and userid = " +req.body.userid  , (err, rows, fields) => {
        if (!err)
         res.render('policy_view',{
         results: rows
          });
          
           // console.log(rows);
        else
            console.log(err);
    })
});

//route for update data
app.post('/update',(req, res) => {
    console.debug(req.body);
  let sql = "UPDATE policyOwner SET Comment='"+req.body.Comment+"', GrantPermission='"+req.body.GrantPermission+"' WHERE policyId="+req.body.id;
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;

    //res.redirect('/');
  });
  console.debug("Calling after update ::" + req.body.userid);
  sql = "SELECT * FROM policyOwner where userid = "+ req.body.userid +"" ;
  let query1 = mysqlConnection.query(sql, (err, rows, fields) => {
    if(err) throw err;

    res.render('policy_view',{
        results: rows
         });
  });
});

app.post('/agent', (req, res) => {
    console.log(req.body.opt)
    mysqlConnection.query("SELECT * FROM policyOwner where AgentId = '"+ req.body.opt +"'" , (err, rows, fields) => {
        if (!err)
         res.render('policy_view',{
         results: rows
          });
          
           // console.log(rows);
        else
            console.log(err);
    })
   
});

app.get('/login', (req, res) => {
    
         res.render('login_view')
         
});

app.post('/login',(req, res) => {
    let sql ="";
    let page = "";

    if (req.body.accountType == '3'){
        sql = 'SELECT * FROM policyOwner where userid = ' + req.body.loginId;
        page = "policy_view";
    }
    if (req.body.accountType == '2'){
        sql = 'SELECT * FROM policyOwner where agentId = ' + req.body.loginId;
        page = "agent_view";
    }

    if (req.body.accountType == '1'){
        sql = 'SELECT * FROM Agent';
        page = "admin_view";
    }

    if (req.body.accountType == '4'){
        sql = 'SELECT * FROM  webmasterrequest'
        page = "web_master_view";
    }
    if (req.body.accountType == '5'){
        sql = 'SELECT * FROM webmasterrequest';
        page = "claimant_view";
    }
    console.log(sql);
    let query = mysqlConnection.query(sql, (err, rows, fields) => {
      if(err) throw err;
      res.render(page,{
        results: rows
         });
    });
  });

  app.post('/agentSearch', (req, res) => {
    console.log(req.body.opt)
    mysqlConnection.query("SELECT * FROM policyOwner where agentId = "+ req.body.AgentId +" and active = " +
    
            req.body.opt +"", (err, rows, fields) => {
        if (!err)
         res.render('agent_view',{
         results: rows
          });
          
           // console.log(rows);
        else
            console.log(err);
    })
});


//route for Add Agent data
app.post('/addAgent',(req, res) => {
    console.debug(req.body);
  let sql = "insert into agent (name,address,phoneno,active, companyname) values(  '"+req.body.name+"',  '"+req.body.address+"' ,  " + req.body.phoneno+
  " ,   " + req.body.active +" ,  '"+req.body.companyname+" ' )";
  
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;

    //res.redirect('/');
  });
  console.debug("Calling after update ::" + req.body.userid);
  sql = "SELECT * FROM  agent" ;
  let query1 = mysqlConnection.query(sql, (err, rows, fields) => {
    if(err) throw err;

    res.render('admin_view',{
        results: rows
         });
  });
});

//route for update Agent data
app.post('/updateAgent',(req, res) => {
    console.debug(req.body);
  let sql = "UPDATE agent SET name = '"+req.body.name+"', address = '"+req.body.address+"' , phoneno = " + req.body.phoneno+
  " ,  active = " + req.body.active +" , companyname = '"+req.body.companyname+"' where agentid = " + req.body.id;
  
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;

    //res.redirect('/');
  });
  console.debug("Calling after update ::" + req.body.userid);
  sql = "SELECT * FROM  agent" ;
  let query1 = mysqlConnection.query(sql, (err, rows, fields) => {
    if(err) throw err;

    res.render('admin_view',{
        results: rows
         });
  });
});


//route for update Agent data
app.post('/deleteAgent',(req, res) => {
    console.debug(req.body);
  let sql = "delete from agent where agentid = "+req.body.agentid;
  
  let query = mysqlConnection.query(sql, (err, results) => {
    if(err) throw err;

    //res.redirect('/');
  });
  console.debug("Calling after update ::" + req.body.userid);
  sql = "SELECT * FROM  agent" ;
  let query1 = mysqlConnection.query(sql, (err, rows, fields) => {
    if(err) throw err;

    res.render('admin_view',{
        results: rows
         });
  });
});



app.post('/webMasterRequest',(req, res) => {
    let url = "http://localhost:3000/policyViewById/"+ req.body.policyid;
    let data = {policyid: req.body.policyid, policyamount: req.body.policyamount, url : url};
    let sql = "INSERT INTO webmasterrequest (policyid, policyamount, url) VALUES ( " +
                req.body.policyid  +"," + req.body.policyamount + ", '"+ url +"')" ;
    let query = mysqlConnection.query(sql, (err, results) => {
      if(err) throw err;
    });

    sql = "SELECT * FROM  webMasterRequest" ;
  let query1 = mysqlConnection.query(sql, (err, rows, fields) => {
    if(err) throw err;

    res.render('web_master_view',{
        results: rows
         });
  });

  });

  //policy view by id
app.get('/policyViewById/:policyid',(req, res) => {
    console.debug(req.params.policyid);
    sql = "SELECT * FROM  policyOwner where policyid = "+  req.params.policyid;
  let query1 = mysqlConnection.query(sql, (err, rows, fields) => {
    if(err) throw err;

    res.render('single_policy_view',{
        results: rows
         });
  });
  
  
 
});

