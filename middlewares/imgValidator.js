import {fileTypeFromBuffer} from 'file-type';

export const imgValidator = async (req,res,next)=>{
    const {file} = req;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if(allowedTypes.includes(file.mimetype)){

        try {
        const fileType = await fileTypeFromBuffer(file.buffer);
        if(!fileType || !fileType.mime.startsWith('image/')){
            const err = new Error("Invalid file");
            err.status = 400;
            throw err;
        }

        next();
        } catch (error) {
            console.log(error);
            const err = new Error("Invalid file");
            err.status = 400;
            throw err;
        }
        
    }else{

        const err = new Error("Invalid format, allowed formats(JPEG, PNG, GIF, WEBP)")
        err.status = 400;
        throw err;
    };

    
}