import express, { json } from "express";
import userRouter from "./routes/usersRoutes.js";
import quotesRouter from "./routes/quotesRoutes.js";
import { corsMiddleware } from "./middlewares/cors.js";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(corsMiddleware());

app.use(json()); 

app.use('/api/users', userRouter);

app.use('/api/patients', quotesRouter );

app.all('/*splat', (req, res, next)=>{
    res.status(404).json({message: 'Route not found'});
});

app.use((err, req, res, next)=>{
    const {status = 500, message = 'Internal Server Error' } = err;
    res.status(status).json({message});
})

app.listen(PORT, ()=>{
    console.log(`Server listen in port ${PORT}`);
})