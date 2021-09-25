module.exports = mongoose=>{
    const schema = mongoose.Schema(
        {
            name:{
                type: String,
                required: [true , "Contecy name is required"],
            },
            email:{
                type: String,
                trim: true,
                lowercase : true,
            },
            address: String,
            phone: String,
            favourite: Boolean,
        },
        {timestamps:true}
    );
    //replace _id with id and remove
    schema.method("toJSON",function(){
        const{_v, _id, ...object} = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("contact", schema);
};