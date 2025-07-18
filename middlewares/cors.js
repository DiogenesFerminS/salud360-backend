import cors from "cors";



export const corsMiddleware = ()=> cors({
    origin: (origin, callback) =>{
        const ACCEPTED_ORIGINS = [process.env.FRONTEND_URL];
        //Permite solicitudes sin origen como postman
        if(!origin){
            return callback(null, true);
        };

        if(ACCEPTED_ORIGINS.includes(origin)){
            return callback(null, true);
        };

        return callback(new Error("Not allowed by CORS"))
    },
    credentials:true,
});