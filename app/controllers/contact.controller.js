exports.create = async(req , res)=>{
    res.send({message:"create handler"});
};

exports.findAll = async (req , res) =>{
    res.send({message:"FindAll handler"});
};

exports.findOne = async (req, res) =>{
    res.send({message:"FindOne handler"});
};
exports.update = async (req, res) =>{
    res.send({message:"Update handler"});
};
exports.delete = async (req, res) =>{
    res.send({message:"delete handler"});
};
exports.deleteAll = async (req, res) =>{
    res.send({message:"deleteAll handler"});
};
exports.findAllFavorite = async (req , res) =>{
    res.send({message:"FindAllFavourite handler"});
};


const {handle ,BadRequestError} = require("../helpers/errors");
const db = require("../models");
const Contact = db.Contact;

//create and Save
exports.create= async(req , res,next) =>{
    if(!req.body.name){
        return next(new BadRequestError(400,"Name can not be empty"));
    }

    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favourite: String(req.body.favourite).toLowerCase()=="true",
    });

    const [error, document] = await handle(contact.save());

    if(error){
        return next(new BadRequestError(500,
            "An error occurred while creating the contact"));
    }

    return res.send(document);
};

// retrieve all contacts ò a user from the database
exports.findAll = async(req,res,next)=>{
    const condition ={ };
    const name = req.query.name;
    if(name){
        condition.name = {$regex: new RegExp(name), $options: "i"};
    }
    const [error, documents] = await handle(Contact.find(condition));

    if(error){
        return next(new BadRequestError(500,
            "An error occurred while retrieving contacts "));
    }

    return res.send(documents);
};
// find a single contact with an id
exports.findOne = async (req,res,next) =>{
    const condition = {
        _id: req.params.id,
    };

    const[error,document] =await handle(Contact.findOne(condition));

    if(error){
        return next (new BadRequestError(500,
            `Error retrieving contact with id=${req.params.id}`));
    }

    if(!document){
        return next(new BadRequestError(404,"Resource not found"));
    }

    return res.send(document);
};

// update a contact by the id in the request 
exports.update = async (req,res,next) =>{
    if(!req.body){
        return next(new BadRequestError(400,
            "Data to update can not be empty"));
    }
    const condition = {
        _id: req.params.id,
    };

    const[error,document] =await handle(
        Contact.findOneAndUpdate(condition, req.body,{
            new: true,
        })
    );

    if(error){
        return next (new BadRequestError(500,
            `Error updating contact with id=${req.params.id}`));
    }

    if(!document){
        return next(new BadRequestError(404,"Contact not found"));
    }

    return res.send({message: "Contact was updated successfully",});
};

// delate a contact with the specified  id in the request
exports.delete = async (req,res,next) =>{
    const condition = {
        _id: req.params.id,
    };

    const[error,document] =await handle(
        Contact.findOneAndDelete(condition)
    );

    if(error){
        return next (new BadRequestError(500,
            `Could not delete contact with id=${req.params.id}`));
    }

    if(!document){
        return next(new BadRequestError(404,"Contact not found"));
    }

    return res.send({message: "Contact was deleted successfuly",});
};

// find all favourite contact of a user
exports.findAllFavourite = async (req,res,next) =>{
    
    const[error,documents] =await handle(
        Contact.find({favourite: true ,})
    );

    if(error){
        return next (new BadRequestError(500,
            `An error occurred retrieving favourite contact`));
    }

    return res.send(documents);
};

// Delete all contact of user from the database
exports.deleteAll = async (req,res,next) =>{

    const[error,data] =await handle(
        Contact.deleteMany({ })
    );

    if(error){
        return next (new BadRequestError(500,
            "An error occurred while removing all contact"));
    }

   

    return res.send({
        message: `${data.deletedCount} contact were deleted successfuly`,     
    });
};