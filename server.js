const express = require("express");
const cors = require("cors");
const config = require("./app/config");
const app = express();
const{BadRequestError} = require("./app/helpers/errors");
const setupContactRoutes = require("./app/routes/contact.routes");
app.use(cors({origin: config.app.origins}));

setupContactRoutes(app);
app.use(express.json());

app.use(express.urlencoded({extended: true}));
//handler 404
app.use((req , res,next)=>{
    next(new BadRequestError(404 ,"Resourse not found"));
});
//mongoose
app.use(express.urlencoded({extended:true}));
const db = require("./app/models");
db.mongoose.connect(config.db.url)
    .then(()=>{
        console.log("Connected to the database!");
    })
    .catch((error)=>{
        console.log("Cannot connect to the database!", error);
        process.exit();
    });

    
app.use((err,req,res,next)=>{
    console.log(err);
    res.status(err.statusCode  || 500).json({
        message: err.message || "Internal Server Error",
    });
});

app.get("/",(req, res) =>{
    res.json({message: "Welcome to contact book application"});
});

const PORT = config.app.port;
app.listen(PORT, ()=>{
    console.log(`Server is running on post ${PORT}.`);
});