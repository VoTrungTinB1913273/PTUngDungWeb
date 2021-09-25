const handle = (promise) =>{
    return promise.then(data =>[null,data]).catch(error =>[error,undefined]);
};

class BadRequestError extends Error {
    constructor(statusCode , messeage){
        super();
        this.statusCode = statusCode;
        this.message = messeage;
    }
}

module.exports={
    handle,
    BadRequestError,
}