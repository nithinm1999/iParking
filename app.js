var express = require('express')
var app = express()
var bodyParser = require('body-parser')


app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

    var mysql=require('mysql')
    var con=mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'zxcvbnm@123',
        database: 'iparking'
    });
    con.connect(function(err){
        if(err) throw err;
        console.log('connected!');
        });

    app.get('/',function(req,res){
        console.log("start")
        res.render('home')
    })

    app.get("/register",function(req,res){
        console.log('hey')
        res.render('register')
    })

    app.get("/feedback",function(req,res){
        console.log('hello')
        res.render('feedback')
    })

    app.get("/admin",function(req,res){
        console.log('hello')
        res.render('admin')
    })

    app.get("/info",function(req,res){
        console.log('hello')
        res.render('info')
    })

    app.get("/slot",function(req,res){
        console.log('hello')
        res.render('slot')
    })
    
    app.post("/signup",function(req, res){
        if(req.body.select=="1"){
            var v={
                name: req.body.nm,
                idusn: req.body.id,
                mailid: req.body.mid,
                phno: req.body.ph,
                amt:0
                };
            var q1="insert into student set ?";
            con.query(q1,v,function(err, result, fields){
                if(err)throw err;
                else
                {
                    console.log(result);
                    res.render('thanks')
                }
            });
            if(req.body.select1=='1'){
                var b={
                    idusn:req.body.id,
                    vehicle_type:'2',
                    day_counter:0
                };
                var q2="insert into amount set ?";
                con.query(q2,b,function(err,result,fields){
                    if(err)throw err;
                else
                {
                    console.log(result);
                    res.render('thanks')
                }
                });
                }
                else if(req.body.select1=='2'){
                var c={
                    idusn:req.body.id,
                    vehicle_type:'4',
                    day_counter:0
                };
                var q2="insert into amount set ?";
                con.query(q2,c,function(err,result,fields){
                    if(err)throw err;
                else
                {
                    console.log(result);
                    res.render('thanks')
                }
                });
                }
                else{
                    var o={
                        idusn:req.body.id,
                        vehicle_type:'2',
                        day_counter:0
                    };
                    var q3="insert into amount set ?";
                    con.query(q3,o,function(err,result,fields){
                        if(err)throw err;
                    else
                    {
                        console.log(result);            
                            }
                    });
                    var o1={
                        idusn:req.body.id,
                        vehicle_type:'4',
                        day_counter:0
                    };
                    var q4="insert into amount set ?";
                    con.query(q4,o1,function(err,result,fields){
                        if(err)throw err;
                    else
                    {
                        console.log(result);                 
                       }
                       res.render('thanks')

                    });
                }
               
        }
        else
        {
            var v1={
                name: req.body.nm,
                sidusn: req.body.id,
                mailid: req.body.mid,
                phno: req.body.ph
                };
            var q2="insert into staff set ?";
            con.query(q2,v1,function(err, result, fields){
                if(err)throw err;
                else
                {
                    console.log(result);
                    res.render('thanks')
                }
            });
        }
    });

    app.post("/feed",function(req, res){

        if(req.body.select=="s1"){
            var v={
                idusn: req.body.id,
                rating: req.body.rating,
                feedback: req.body.feedback
                };
            var q1="insert into student_feed set ?";
            con.query(q1,v,function(err, result, fields){
                if(err){
                    res.render('tfeed1');
                }
                else
                {
                    console.log(result);
                    res.render('tfeed2')
                }
            });
        }
        else
        {
            var v1={
                sidusn: req.body.id,
                rating: req.body.rating,
                feedback: req.body.feedback
                };
            var q2="insert into staff_feed set ?";
            con.query(q2,v1,function(err, result, fields){
                if(err){
                    res.render('tfeed1');
                }
                else
                {
                    console.log(result);
                    res.render('tfeed2')
                }
            });
        }
    });
    app.post("/admin", function(req, res) {
        var adminid= req.body.aid;
        var passwd= req.body.pd;
        con.query('SELECT * FROM admin WHERE adminid = ?',[adminid], function (error, results, fields) {
        if (error) {
          console.log("error ocurred",error);
          res.render("admin");
        }
        else{
          if(results.length >0){
            if(results[0].passwd == passwd){
                    res.render("access");
                  }
                  else{
                    res.render("admin");
              }
            }
          
        }
         
    });});


    app.post("/access",function(req,res){
        if(req.body.select2==='1'){
              var idusn=req.body.idusn;
              var u="update amount a set day_counter=(select count(distinct park_indate) from student_parks sp where sp.idusn=a.idusn and sp.vehicle_type=a.vehicle_type group by idusn,vehicle_type)";
              con.query(u,function(err,result,fields){
                if(err){
                    res.render('access');
                }
                else{
                    console.log(result);
                }
            });
            var u1="SELECT * FROM student WHERE idusn = ?";
            con.query(u1,[idusn],function(err, result, fields){
                if(err){
                    res.render('access');
                }
                else
                {
                    if(result.length==0){
                        var q="UPDATE student set amt=0";
        con.query(q,function(err,result,fields){
            if(err){
                throw err;
            }
            else{
                console.log(result);
                res.render("access");
            }
        });
                        res.render('access');
                    }
                    else{
                    console.log(result);
                    res.render('access1',{a:result});
                    }
                }
            });
        }
        else if(req.body.select2==='2'){
            var sidusn=req.body.idusn;
            con.query("SELECT * FROM staff WHERE sidusn = ?",[sidusn],function(err, result, fields){
                if(err){
                    throw err;
                    res.render('access');
                }
                else
                {
                    if(result.length==0){
                        res.render('access');
                    }
                    else{
                    console.log(result);
                    res.render('access2',{b:result});
                    }
                }
            });
        }
        else{
            var rfid=req.body.idusn;
            con.query("SELECT * FROM visitor WHERE rfid = ?",[rfid],function(err, result, fields){
                if(err){
                    throw err;
                    res.render('access');
                }
                else
                {
                    if(result.length==0){
                        res.render('access');
                    }
                    else{
                    console.log(result);
                    res.render('access3',{c:result});
                    }
                }
            });
        }
    });
    app.post("/refresh",function(req,res){
        var q="UPDATE student set amt=0";
        con.query(q,function(err,result,fields){
            if(err){
                throw err;
            }
            else{
                console.log(result);
                res.render("access");
            }
        });
    });
    app.post("/accessfeed",function(req,res){
        con.query('SELECT * FROM student_feed union select * from staff_feed', function (error, result, fields) {
            if (error) {
              console.log("error ocurred",error);
              res.render("access1");
            }
            else{
                res.render("f1",{d:result});
              
            }
             
        });
    });
    app.post("/paid",function(req,res){
        con.query('delete from student where idusn=?',[req.body.paid],function(error,result,fields){
            if (error) {
                console.log("error ocurred",error);
                res.render("access1");
              }
              else{
              } 
        });
        var q="call proc1()";
        con.query(q,function(err,result,fields){
            if(err){
                throw err;
            }
            else{
                console.log(result);
                res.render("access");
            }
        });
    });
    app.post("/refresh1",function(req,res){
        res.render("access");
    });
    app.post("/refresh2",function(req,res){
        res.render("access");
    });
    app.post("/back",function(req,res){
        res.render("access");
    });
    
    app.listen(5000,function(){
        console.log("server started")
    })

