import mysql from "mysql2/promise";

const config ={
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME   
};

const connection = await mysql.createConnection(config);

export class QuotesModel {

    static addQuote = async({quote}) => {

        try {
            const {name, lastname, symptoms, date, hour_start, hour_end, phone, email, owner} = quote;

            const [resp, tableInfo] = await connection.query(
                `INSERT INTO quotes (name, lastname ,symptoms, appointment_date, hour_start, hour_end, phone, email, owner) 
                VALUES 
                (?, ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?));
                `, [name, lastname, symptoms, date, hour_start, hour_end, phone, email, owner]
            );
            return {message: "Appointment created successfully "}
        } catch (error) {
            const err = new Error("Failed to create an Appointment");
            err.status = 400;
            throw err;
        }
        
    };

    static getQuotes = async({owner}) =>{
        try {
            const [resp, tableInfo] = await connection.query(
                `SELECT BIN_TO_UUID(id) as id, name, symptoms, appointment_date, hour_start, hour_end, filled, phone, email, BIN_TO_UUID(owner) as owner 
                FROM quotes WHERE owner = UUID_TO_BIN(?);`, [owner]
            );

            return resp;

        } catch (error) {
            const err = new Error("Failed to get Appointment");
            err.status = 404;
            throw err;
        }
    };

    static getOneQuote = async({id, user}) =>{

        let quote;

        try {
            
            const [resp , info] = await connection.query(
                `SELECT BIN_TO_UUID(id) as id, name, lastname ,symptoms, appointment_date, hour_start, hour_end, filled, phone, email, BIN_TO_UUID(owner) as owner 
                FROM quotes WHERE id = UUID_TO_BIN(?)`,[id]
            );

            quote = resp;

        } catch (error) {
            const err = new Error("Invalid id");
            err.status = 400;
            throw err;
        };
        
        if(quote.length === 0){
            const err = new Error("Quote not found");
            err.status = 404;
            throw err;
        };

        if(quote[0].owner !== user.id){
            const err = new Error("Access denied");
            err.status = 403;
            throw err;
        };

        return quote;
    };

    static updateQuote = async({id, user, body})=>{
        let quote;

        try {
            
            const [resp , info] = await connection.query(
                `SELECT BIN_TO_UUID(id) as id, name, lastname , symptoms, appointment_date, hour_start, hour_end, filled, phone, email, BIN_TO_UUID(owner) as owner 
                FROM quotes WHERE id = UUID_TO_BIN(?)`,[id]
            );

            quote = resp;

        } catch (error) {
            const err = new Error("Invalid id");
            err.status = 400;
            throw err;
        };
        
        if(quote.length === 0){
            const err = new Error("Quote not found");
            err.status = 404;
            throw err;
        };

        if(quote[0].owner !== user.id){
            const err = new Error("Access denied");
            err.status = 403;
            throw err;
        };

        const { name, lastname ,symptoms, appointment_date, hour_start, hour_end, phone, email } = quote[0];

        const updateQuote = {
            name,
            lastname,
            symptoms,
            appointment_date,
            hour_end,
            hour_start,
            phone, 
            email,
            ...body
        };


        try {
            
            const [resp, tableInfo] = await connection.query(
                `
                UPDATE quotes 
                SET name = ?, lastname = ?, symptoms = ?, appointment_date = ?, 
                hour_end = ?, hour_start = ?, phone = ?, email = ?
                WHERE id = UUID_TO_BIN(?);
                `, [updateQuote.name, updateQuote.lastname, updateQuote.symptoms, updateQuote.appointment_date, updateQuote.hour_end, updateQuote.hour_start, updateQuote.phone, updateQuote.email, id]
            );

            return {message: "the appointment has been updated successfully"};
        } catch (error) {
            const err = new Error("Failed update");
            err.status = 400;
            throw err;
        };
    };

    static deleteQuote = async({id, user})=>{
        let quote;

        try {
            
            const [resp , info] = await connection.query(
                `SELECT BIN_TO_UUID(id) as id, name, lastname , symptoms, appointment_date, hour_start, hour_end, filled, phone, email, BIN_TO_UUID(owner) as owner 
                FROM quotes WHERE id = UUID_TO_BIN(?)`,[id]
            );

            quote = resp;

        } catch (error) {
            const err = new Error("Invalid id");
            err.status = 400;
            throw err;
        };
        
        if(quote.length === 0){
            const err = new Error("Quote not found");
            err.status = 404;
            throw err;
        };

        if(quote[0].owner !== user.id){
            const err = new Error("Access denied");
            err.status = 403;
            throw err;
        };

        try {
            
            const [resp, info] = await connection.query(
                `DELETE FROM quotes WHERE id = UUID_TO_BIN(?);`,[id]
            );

            return {message: "Quote successfully deleted"};

        } catch (error) {
            const err = new Error("Delete failed");
            err.status = 400;
            throw err;
        }
    }
    
};