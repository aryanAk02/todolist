
const express=require("express");
const bodyParser=require("body-parser");
const date=require(__dirname+"/date.js");
const _=require("lodash");
const mongoose=require("mongoose");


const app=express();

var items=[];
var workItems=[];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
mongoose.connect("mongodb://127.0.0.1:27017/todolistDb");

const itemSchema=new mongoose.Schema({
    name:String
});
const listSchema=new mongoose.Schema({
    name:String,
    items:[itemSchema]
});
const Item=new mongoose.model("Item",itemSchema);
const List=new mongoose.model("List",listSchema);

const item1=new Item({
    name:"drive"
})
const item2=new Item({
    name:"eat"
})
const item3=new Item({
    name:"clean"
})

const defaultItems=[item1,item2,item3];

app.listen(3000,function(){
    console.log("server started on port 3000");
})

app.get("/",function(req,res){
    let day=date.getDate();
    Item.find().then(function(foundItems){
        if(foundItems.length===0)
        {
            Item.insertMany(defaultItems);
            res.redirect("/");
        }else{
            res.render("list",{listTitle:"Today",newItems:foundItems});
        }
    })
})
   
app.post("/",function(req,res){
    const itemName=req.body.newItem;
    const listName=req.body.btn;

    const item=new Item({
        name:itemName
    })
    if(listName==="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName}).then(foundList=>{
        foundList.items.push(item);
        foundList.save();
        res.redirect("/"+listName);
        })
    }
})

app.post("/delete",function(req,res){
    const checkedItem=req.body.checkbox;
    const listName=req.body.listName;
    if(listName ==="Today"){
        Item.findByIdAndRemove(checkedItem).exec();
        res.redirect("/");
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}}).then(foundList=>{
            res.redirect("/"+listName);
        })
    }
})

app.get("/:topic",function(req,res){
    const customListName=_.capitalize(req.params.topic);
    List.findOne({name:customListName}).then(foundList=>{
        if(!foundList){
            const list=new List({
                name:customListName,
                items:defaultItems
            });
            list.save();
            res.redirect("/"+customListName);
        }else{
            res.render("list",{listTitle:foundList.name,newItems:foundList.items});
        }
    })
})

app.get("/about",function(req,res){
    res.render("about");
})

