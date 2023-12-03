import EErrors from "../../services/errors/enums.js";
export default (error,req,res,next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.MISSING_OR_INVALID_PRODUCT_DATA, EErrors.MISSING_OR_INVALID_USER_DATA:
            res.send({status:"error", error:error.name})
            break;
        default:
           res.send({status:"error", error:"Unhandled error"})               
    }

}
