var express = require("express");
var app = express();
var mongoose = require("mongoose");
var URL = require('url-parse');
var googleImages = require('google-images');
var client = new googleImages('000419201685237040878:zyxg1dtrkgy', 'AIzaSyBUe6oZqtqL9Di0NPXLSQSN_3btBWT7Qac');
var searchSchema = new mongoose.Schema({
    keyword: String,
    offset: Number,
});
var Search = mongoose.model('Search', searchSchema);


app.set("view engine", "ejs");
mongoose.connect("mongodb://phuong:phuong@ds129462.mlab.com:29462/image-search-abstraction-layer", function(err, db){
    if (err) {
        console.log("Unable to connect to server", err);
    } else {
        console.log("Connected to server");
    }
});

app.get("/", function(req,res){
    res.render('index')
})

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
app.get("/api/latest/imagesearch/", function(req, res){
    res.json(latestSearches)
})

// get search results

function transformedGoogleResult(googleResult) {
    return googleResult.map((item) => {
        return {
            url: item.url,
            snippet: item.url.split("/").pop().split(".").shift().replace(/\W+/g, " "),
            thumbnail: item.thumbnail.url,
            context: new URL(item.url).origin
        }
    });
}

app.get("/api/imagesearch/:keyword", function(req,res){
    console.log(req.params.keyword);
    var keyword = req.params.keyword;
    var offset = req.query.offset || 1;
    addLatestSearch(keyword);
    // client.search(keyword, {
    //     page: offset
    // }).then(result => {
    //     res.json(transformedGoogleResult(result));
    // }, (reason) => {
    //     res.json(reason);
    // });
    res.json(client.search('dogs', {page: 2}));
    // res.send("hi!")
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is runnning!!");
})