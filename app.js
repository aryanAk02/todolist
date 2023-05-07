
const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js")

const app=express();

var items=[];
var workItems=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

app.listen(3000,function(){
    console.log("server started on port 3000");
})

app.get("/",function(req,res){
    let day=date.getDate();
    res.render("list",{dayList: day,newItems: items});
})

app.post("/",function(req,res){
    var i=req.body.newItem;
    if(req.body.list=="WORKING DAY"){
        workItems.push(i);
        res.redirect("/work");
        
    }
    else{
        
        items.push(i);
        res.redirect("/");
        
    }   
        
})

app.get("/work",function(req,res){
    
    res.render("list",{dayList:"WORKING DAY",newItems:workItems})
})

