const express = require("express");
const MongoClient = require('mongodb').MongoClient;
const ehandlebars = require("express-handlebars"); 
const path = require('path');
const multer = require("multer");
const fileSystem = require('fs');
const sharp = require('sharp');
const ObjectId = require('mongodb').ObjectID;

const url = "mongodb://localhost:27017";

const app = express();
const formData = multer();

//mangoDB init
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
.then(client => {
  const db = client.db('articles');
  const collection = db.collection('articledata'); 
  app.locals.collection = collection;
  app.listen(process.env.PORT || 3000);
}).catch(error => console.error(error));

//init view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', ehandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// loadind public static files
app.use(express.static(path.join(__dirname, 'public')));

// init json & text data
app.use(express.json());
app.use(express.text());

//article search
app.get("/search/:searchdata", (req, res) => {
    const searchdata = req.params.searchdata;
    const regex = new RegExp(searchdata, 'i');
    const collection = req.app.locals.collection;
    collection.find({$or: [{"title": regex}, {"cat": regex}]}, {"content": 0}).sort({"timestamp": -1}).limit(5).toArray((err, data) => {
        res.json(data);
    })
})

// sending article reading page and counting views
app.get('/post/:postdata', (req, res) => {
    const postdata = req.params.postdata.split("-");
    postId = postdata[postdata.length - 1];
    if(postId.length != 24){
        res.render('404');
    } else {
    const collection = req.app.locals.collection;
    const id = new ObjectId(postId);
    collection.find({"_id": id}).toArray((err, data) => {
        collection.find({"cat": data[0].cat}, {"content": 0}).sort({"timestamp": -1}).skip(Math.floor(Math.random() * 7)).limit(3).toArray((err, data1) => {
            if (data.length > 0) {
                res.render("post", {data:data[0],recommended:data1});
                const viewIncrease = data[0].views + 1
                collection.updateOne({"_id": id}, {$set: {"views": viewIncrease}}, {multi: true}, () => {})
            } else {
                res.render('404');
            }
        })
    })
    }
});

// sending post cards json data for home page
app.get("/cardsdata/:dataload", (req, res) => {
    const urlpara = req.params.dataload.split(',');
    const dataload = parseInt(urlpara[1]);
    const collection = req.app.locals.collection;
    if (urlpara[0] == "latest") {
        collection.find({}).sort({"timestamp": -1}).skip(dataload).limit(6).toArray((err, data) => {
            res.json(data);
        })
    } else {
        let nowDate = Date.now();
        let dateDiff = nowDate - 2629746000;
        collection.find({"timestamp": {$gt: dateDiff}}, {"content": 0}).sort({"views": -1}).skip(dataload).limit(6).toArray((err, data) => {
            res.json(data);
        })
    }
})

// loading category pages
app.get('/:category', (req, res) => {
    const categories = ["news", "space", "health", "tech", "animals", "nature", "history", "experiments"]; //Array of categories
    category = req.params.category.toLowerCase();
    const collection = req.app.locals.collection;
    if (categories.includes(category)) {
        collection.find({"cat": category}, {"content": 0}).sort({"timestamp": -1}).skip(parseInt(0)).limit(6).toArray((err, data) => {
          res.render('category', {title:category, categories:categories, data:data});
        })
    } else {
        res.render('404');
    }
})

// sending category page post cards json data
app.get("/categorydata/:loaddata", (req, res) => {
    const loaddata = req.params.loaddata.split(",");
    const categoryData = loaddata[1];
    const collection = req.app.locals.collection;
    collection.find({"cat": categoryData}, {"content": 0}).sort({"timestamp": -1}).skip(parseInt(loaddata[0])).limit(6).toArray((err, data) => {
        res.json(data)
    })
})

// admin login page validation and url
app.get("/scienceadminlogin/:adminName/:adminPass", (req, res) => {
    const adminName = req.params.adminName;
    const adminPass = req.params.adminPass;
    if (adminName == "admin" && adminPass == "scienceversion") {
        res.render('adminlogin');
    } else {
        res.render('404');
    }
})

// admin login page validation and url
app.post("/adminPanel", formData.none(), (req, res) => {
    if (req.body.username == "nikithb" && req.body.pass == "nikki4833") {
        res.render('admin');
    } else {
        res.json("INCORRECT EMAIL OR PASS")
    }
})

// storing images to file system
const storage = multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
}).single("SciencVersionImage")

// images resize
function imageResize(imagePath, imageName){
    sharp(imagePath)
    .resize(330, 350)
    .toFile(`./public/uploads/card/${imageName}`, (err, info) => {});

    sharp(imagePath)
    .resize(263, 170)
    .toFile(`./public/uploads/recommonded/${imageName}`, (err, info) => {});
}

// getting and storing article data to database
app.post("/scienceadmineditor", (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.json(err)
        } else {
            const data = req.body;
            const date = new Date()
            data.imageurl = `/uploads/${req.file.filename}`;
            imageResize(req.file.path, req.file.originalname);
            data.imageCardUrl = `/uploads/card/${req.file.originalname}`;
            data.imageRecommondedUrl = `/uploads/recommonded/${req.file.originalname}`;
            data.timestamp = Date.now();
            data.date = date.toDateString();
            data.views = 0;
            data.url = data.title.replace(/ /g, "-").replace(/\?|\//g, "");
            const collection = req.app.locals.collection;
            collection.insertOne(data);
            collection.find({$or: [{"timestamp": data.timestamp}, {"title": data.title}]}, {"content": 0}).toArray((err, d) => {
                return res.redirect(`/post/${d[0].url}-${d[0]._id}`);
            })
        }
    })
})

//deleting post
app.post("/deletepost", (req, res) => {
    const postId = req.body;
    const collection = req.app.locals.collection;
    const id = new ObjectId(postId);
    collection.find({"_id": id}).toArray((err, data) => {
        const imagePath = [`./\public${data[0].imageurl}`, `./\public${data[0].imageCardUrl}`, `./\public${data[0].imageRecommondedUrl}`]
        imagePath.forEach((filepath)=>{
            fileSystem.unlink(filepath, (err) => {if(err) console.log("no image")})
        })
    })
    collection.deleteOne({"_id": id}, {}, (err) => {
        if (err) {
            res.json("Some Thing Went Wrong")
        } else {
            res.json("DELETED")
        }
    })
})

//loading global 404 error page
app.get('*', (req, res) => {
    res.render('404');
});