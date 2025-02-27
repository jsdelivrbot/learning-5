let Request = require("request");
let nsoProvider=require('./../NSOAPI/NSOAPIMethods');
  let LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
let nsoUser="admin";
let nsoPassword="admin";
let customer_name="customer-name";
let customer_value="CISCO";
let serviceName="ml2:mpls-l2vpn";
let nsoURL="http://192.168.0.111:8080/jsonrpc";
module.exports.loginNSO=function(req,res){

  let json=JSON.stringify({
        "id": "1",
        "jsonrpc": "2.0",
        "method":"login",
        "params":{
                  "user": nsoUser,
                  "passwd": nsoPassword
                  }
    });
var loginService=Request.post({
    "headers": { "content-type": "application/json" },
    "url": nsoURL,
    "body": json
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    console.log(body);
    //console.log(body);
     let jsonBody=JSON.parse(response.body);
   

    if(jsonBody.result!=null){
     
     let cookie=response.headers['set-cookie'][0].split(";");
    console.log(cookie+" "+cookie.length);
      for (let i = 0; i < cookie.length; i++) {
        if (cookie[i].indexOf("sessionid")!=-1) {
          localStorage.setItem("NSOSessionId", cookie[i]);
          console.log("cookie[i]"+cookie[i]);
        }
      }
    }
    console.log(localStorage.getItem("NSOSessionId"));
    res.json(jsonBody);
});

}
module.exports.logoutNSO=function(req,res){
var loginService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": JSON.stringify({
        "id": "2",
        "jsonrpc": "2.0",
        "method":"logout"
    })
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    console.log(body);
    //console.log(body);
     let jsonBody=JSON.parse(response.body);
   

    if(jsonBody.result!=null){

          localStorage.removeItem("NSOSessionId");
          localStorage.removeItem("NSOTH");
          localStorage.clear();
    }
    
    res.json(jsonBody);
});
}
module.exports.transNSO=function(req,res){
var transService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": JSON.stringify({
        "id": "2",
        "jsonrpc": "2.0",
        "method":"new_trans",
        "params":{
                  "db": "running",
                  "conf_mode": "private",
                  "mode": "read_write"
                  }
    })
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(body);
    
        let jsonBody=JSON.parse(response.body);
   

    if(jsonBody.result!=null){
     
     
          localStorage.setItem("NSOTH", jsonBody.result.th);
        
        
    }
    console.log("th value========="+localStorage.getItem("NSOTH"));
    res.json(jsonBody);
});
}
module.exports.getNSOServices=function(req,res){
  let json=JSON.stringify({
        "id": 20,
        "jsonrpc": "2.0",
        "method":"get_service_points"
                   });
  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getData=function(req,res){
  var serviceURL=req.body.serviceName.replace("link","ml3:vpn");
  var selection=req.body.selection;
  console.log("serviceURL"+JSON.stringify(req.body));
  console.log("serviceURLserviceURLserviceURL"+serviceURL);
  console.log("selection"+selection);
  let xpath_expr=""+serviceURL+"[starts-with("+customer_name+",'"+customer_value.toUpperCase()+"') or starts-with("+customer_name+",'"+customer_value.toLowerCase()+"') or starts-with("+customer_name+",'"+customer_value+"')]";
 // selection=['vpn-id', 'topology', 'customer-name','mesh-rd-value'];
  let json=JSON.stringify({
        "id": 4,
        "jsonrpc": "2.0",
        "method":"query",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  //"context_node": "",
                  "xpath_expr": xpath_expr,
                  "selection": selection,
                  "chunk_size": 100000,
                  "initial_offset" : 1,
                  "result_as":"string"
                  }
                   });
  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceSchema=function(req,res){
  var serviceURL=req.body.serviceName;
  var selection=req.body.selection;
  console.log("serviceURL"+JSON.stringify(req.body));
  console.log("serviceURLserviceURLserviceURL"+serviceURL);
  console.log("selection"+selection);
  let path=serviceURL+"{'"+selection+"'}";
  console.log(path);
 let json=JSON.stringify({
        "id": 5,
        "jsonrpc": "2.0",
        "method":"get_schema",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "levels" : -1,
                  "path":path,
                  "namespace":"",
                  "insert_values":false,
                  "evaluate_when_entries":true
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceSchemaByLink=function(req,res){
  var URL=req.body.URL;
  console.log("serviceURL"+JSON.stringify(req.body));
  let path=URL;
  console.log(path);
 let json=JSON.stringify({
        "id": 5,
        "jsonrpc": "2.0",
        "method":"get_schema",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "levels" : -1,
                  "path":path,
                  "namespace":"",
                  "insert_values":false,
                  "evaluate_when_entries":true
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceSetValue=function(req,res){
  var URL=req.body.URL;
  var value=req.body.Value;
  console.log("serviceURL"+JSON.stringify(req.body));
  let path=URL;
  console.log(path);
 let json=JSON.stringify({
        "id": 5,
        "jsonrpc": "2.0",
        "method":"set_value",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "path":path,
                  "value":value
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceGetValue=function(req,res){
  var URL=req.body.URL;
  console.log("serviceURL"+JSON.stringify(req.body));
  let path=URL;
  console.log(path);
 let json=JSON.stringify({
        "id": 5,
        "jsonrpc": "2.0",
        "method":"get_value",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "path":path
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceGetCaseValue=function(req,res){
  var URL=req.body.URL;
  var choice=req.body.choice;
  console.log("serviceURL"+JSON.stringify(req.body));
  let path=URL;
  console.log(path);
 let json=JSON.stringify({
        "id": 5,
        "jsonrpc": "2.0",
        "method":"get_case",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "path":path,
                  "choice":choice
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getDataQuery=function(req,res){
  var context=req.body.context;
  var xpath=req.body.xpath;
  var selection=req.body.selection;
  console.log("serviceURL"+JSON.stringify(req.body));
  console.log("selection"+selection);
  
 // selection=['vpn-id', 'topology', 'customer-name','mesh-rd-value'];
  let json=JSON.stringify({
        "id": 4,
        "jsonrpc": "2.0",
        "method":"query",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "context_node": context,
                  "xpath_expr": xpath,
                  "selection": selection,
                  "chunk_size": 100000,
                  "initial_offset" : 1,
                  "result_as":"string"
                  }
                   });
  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceExist=function(req,res){
  var URL=req.body.URL;
  console.log("serviceURL"+JSON.stringify(req.body));
  let path=URL;
  console.log(path);
 let json=JSON.stringify({
        "id": 5,
        "jsonrpc": "2.0",
        "method":"exists",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "path":path
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceCommit=function(req,res){
 let json=JSON.stringify({
        "id": 150,
        "jsonrpc": "2.0",
        "method":"commit",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "timeout":0,
                  "release_locks":true
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceSync=function(req,res){
  var URL=req.body.URL;
  var action=req.body.action;
 let path=URL+"/"+action;
 let json=JSON.stringify({
        "id": 138,
        "jsonrpc": "2.0",
        "method":"run_action",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "path":path,
                  "params":{},
                  "format":"normal"
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        return console.dir(error);
    }
    
    //console.log(response.body);
    
        let jsonBody=JSON.parse(response.body);
  
    res.json(jsonBody);
});
}
module.exports.getServiceSetValueMethod=function(bw_path,bw_value,callback){
 
  var value=bw_value;
  let path=bw_path;
  console.log(path);
 let json=JSON.stringify({
        "id": 5,
        "jsonrpc": "2.0",
        "method":"set_value",
        "params":{
                  "th":parseInt(localStorage.getItem("NSOTH")),
                  "path":path,
                  "value":value
                  }
                   });

  console.log(json);
var l2vpnService=Request.post({
    "headers": { "Cookie":localStorage.getItem("NSOSessionId"),"content-type": "application/json" },
    "url": nsoURL,
    "body": json
   
}, (error,response, body) => {  
  console.log(error);
    if(error) {
        callback(error);
    }else{
       let jsonBody=JSON.parse(response.body);
  
    callback(jsonBody);
    }
    
    //console.log(response.body);
    
       
});
}