var express = require("express");
var app = express();
var mongoose = require("mongoose");
const googleImages = require('google-images');
const client = new googleImages('000419201685237040878:zyxg1dtrkgy', 'AIzaSyCnst0X_jZXr2mIyeMvBDxheh0Zob2ELbo');


app.set("view engine", "ejs");

mongoose.connect("mongodb://phuong:phuong@ds129462.mlab.com:29462/image-search-abstraction-layer", function(err, db){
    if (err) {
        console.log("Unable to connect to server", err);
    } else {
        console.log("Connected to server");
    }
});


// get landing page
app.get("/", function(req,res){
    res.render('index');
});


// get latest search
var latestSearches = [ ];

function addLatestSearch(str) {
    if (latestSearches.length > 9) {
        latestSearches.pop();
    }
    latestSearches.unshift({
        term: str,
        when: new Date().toISOString()
    });
}

app.get("/api/latest/imagesearch", function(req, res){
    res.json(latestSearches);
});

// get search results
function transformedGoogleResult(googleResult) {
    return googleResult.map((item) => {
        return {
            url: item.url,
            snippet: item.description,
            thumbnail: item.thumbnail.url,
            context: item.parentPage
        }
    });
}

app.get("/api/imagesearch/:keyword", function(req,res){
    var keyword = req.params.keyword;
    var offset = req.query.offset || 1;
    addLatestSearch(keyword);
    client.search(keyword, {
        page: offset
    }).then(result => {
        res.json(transformedGoogleResult(result));
    }, (reason) => {
        res.json(reason);
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is runnning!!");
})