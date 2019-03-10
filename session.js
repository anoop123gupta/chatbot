var express = require("express");
var app = express();
var fs = require('fs');

app.use(express.json());
app.use(express.static('public'));
app.post("/session", ( req,res ) => {
    var response_message = ""; 
    let newSession = {}
    if (!req.body.message || !req.query.email){
        return res.json("message ya email kuch bhi nahi hai ");
    }
    fs.readFile("session.json", 'utf8', (err, data)=>{
        var  sessionScheduler = JSON.parse(data);
        if (err){console.log("here is an error in your code : ", err )}
        else{
           if (req.body.message.toLowerCase().indexOf("i want a new session") > -1 ){
                if (sessionScheduler.length>=1){
                    for (let i=0; i<sessionScheduler.length; i++){
                        if (req.query.email==sessionScheduler[i]['email']){
                            if (sessionScheduler[i]["Title"]=="" || sessionScheduler[i]["Time"]["from" == "" || sessionScheduler[i]["Date"] == ""]){
                                return res.json({err: "class ki sari values fill karo tabhi apka session complete hoga ", classInfo: sessionScheduler[i]})
                            }
                        }
                    }
            }
                newSession = {
                    "email":req.query.email,
                    "Title": "",
                    "Time":{
                        "from":"",         
                        "to":""
                    },
                    "Date": ""
                }
                sessionScheduler.push(newSession);
                response_message = "Give your Class Title";
         }
           else if (req.body.message == "Get all data"){
               return res.json(sessionScheduler);
           }
        else{
            for (let i = 0; i<sessionScheduler.length; i++){
                if (sessionScheduler[i]['email'] == req.query.email){
                    if (sessionScheduler[i]['Title'] == ''){
                        sessionScheduler[i]['Title'] = req.body.message;
                        response_message = "Enter Time";
                    }
                    else if ( sessionScheduler[i]['Time']['from'] == ''){
                        let time  = req.body.message.split(" ");
                        sessionScheduler[i]['Time']['from'] = time[0];
                        sessionScheduler[i]['Time']['to'] = time[2];
                        response_message = "Enter Date";
                    }
                    else if ( sessionScheduler[i]['Date'] == ''){
                        sessionScheduler[i]['Date'] = req.body.message;
                        response_message = "Completed !";
                    }
                newSession = sessionScheduler[i]
                }   
            }
        }  
            fs.writeFile("session.json", JSON.stringify(sessionScheduler, null, 2), (err)=>{
                if (err) {return console.log(err)}
            });
            return res.json({"message": response_message, "data": newSession});
        }
    });
});
// ==========================================

app.get('/session', (req, res)=>{
    fs.readFile('session.json', (err,data)=>{
        var data = JSON.parse(data);
        if (err){console.log(err)}
        else{
            return res.json(data);
        }
    })
})
// ====================================================
app.get("/session/:email", (req, res) =>{
    fs.readFile("session.json", (err, data)=>{
        var data = JSON.parse(data);
        var single_user = [];
            for (var i=0; i<data.length; i++){
                if (data[i]['email']==req.params.email){
                    single_user.push(data[i]);
                }
            }return res.json(single_user)                          
    })
})
app.listen(6000);