import cors from "cors";

const ACCEPTED_ORIGINS = [process.env.FRONTEND_URL];

export const corsMiddleware = ()=> cors({
    origin: (origin, callback) =>{
        //Permite solicitudes sin origen como postman
        if(!origin){
            return callback(null, true);
        };

        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true);
        };

        return callback(new Error("Not allowed by CORS"))
    },
});