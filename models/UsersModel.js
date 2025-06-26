import mysql from "mysql2/promise";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import generateJWT from "../helpers/generateJWT.js";
import generateToken from "../helpers/generateToken.js";
import { emailRegister } from "../helpers/emailRegister.js";
import { emailRecoverPassword } from "../helpers/emailRecoverPassword.js";

dotenv.config();

const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
};

const connection = await mysql.createConnection(config);

export class UsersModel {
    
    static register = async({input})=>{

        const {name, lastname, email, phone, password} = input;
        const token = generateToken();
        
        const existUser = await connection.query(
            `SELECT * FROM users WHERE email = ? OR phone = ? OR token = ?;`, [email, phone, token]
        );

        if(existUser[0].length > 0){
            const error = new Error("The email or phone number is in use");
            error.status = 400;
            throw error;
        };    
        
        const uuidResult = await connection.query(
            `SELECT UUID() uuid`
        );

        const [{uuid}] = uuidResult[0];
        const passwordHashed = await bcrypt.hash(password, parseInt(process.env.ROUNDS_SALT));
        try {
            const result = await connection.query(
                `INSERT INTO users (id, name, lastname, password, email, phone, token) 
                 VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);
                `, [name, lastname, passwordHashed , email, phone, token]
            );
        } catch (err) {
            const error = new Error("The user could not be created");
            error.status = 400;
            throw error;
        };

        const [newUser, tableInfo] = await connection.query(
            `SELECT BIN_TO_UUID(id) as id, name, lastname,password, email, phone, token, confirm FROM users
            WHERE id = UUID_TO_BIN(?);
            `, [uuid]
        );

        emailRegister({
            name,
            email,
            token,
        })

        return newUser;
    };

    static confirm = async({token})=>{
        
        const [user, tableInfo] = await connection.query(
            `SELECT BIN_TO_UUID(id) as id, name, lastname, email,
            phone, token, confirm FROM users WHERE token = ?;
            `, [token]
        );

        if(user.length  === 0){
            const error = new Error("Token invalid");
            error.status = 404;
            throw error;
        };

        const [{id}] = user;

        const [updateUser, info] = await connection.query(
            `UPDATE users SET token = null, confirm = TRUE WHERE id = UUID_TO_BIN(?); `, [id]
        );

        if(updateUser.affectedRows = 0){
            const error = new Error("Confirmation failed");
            error.status = 400;
            throw error;
        };

        return "Account confirmed" ;
    };

    static login = async({input})=>{
        const {email, password} = input;
        const [exist, info] = await connection.query(
            `SELECT BIN_TO_UUID(id) as id, name, lastname,password, email, phone, token, confirm FROM users WHERE email = ?`, [email]
        );
        
        if(exist.length === 0){
            const err = new Error("The email is not assigned to any user.");
            err.status = 404;
            throw err;
        };

        const [{confirm, password:password_db, id}] = exist;

        if(!confirm){
            const err = new Error("Your account must be confirmed to access, check your email to confirm the account");
            err.status = 404;
            throw err;
        }

        const isPasswordValid = await bcrypt.compare(password, password_db );

        if(!isPasswordValid){
            const err = new Error("Incorrect password");
            err.status = 404;
            throw err;
        }
        //autenticar
        const token = generateJWT(id);
        
        return token ;
        
    };

    static findOneById = async ({id})=>{

        const [res, info] = await connection.query(
            `SELECT BIN_TO_UUID(id) as id, name, lastname, email, phone FROM users WHERE id = UUID_TO_BIN(?)`,[id] 
        );

        const [{id:id_r, name:name_r, lastname:last_r, email:email_r, phone:phone_r }] = res;

        const user = {
            id: id_r,
            name: name_r,
            lastname: last_r,
            email: email_r,
            phone: phone_r,
        };
        return user;
    };

    static recoverPassword = async ({email})=>{
        
        const [res, tableInfo] = await connection.query(
            `SELECT BIN_TO_UUID(id) as id, name, lastname, password, email, phone, token, confirm FROM users WHERE email = ?;`, [email]
        );

        if(res.length === 0){
            const err = new Error("Invalid email, there is no user associated with that email.")
            err.status = 400;
            throw err;
        };

        const [{id, name}] = res;

        try {
            const newToken = generateToken();

            const [update, info] = await connection.query(
                `
                UPDATE users
                SET token = ?
                WHERE id = UUID_TO_BIN(?)
                `, [newToken, id]
            ); 
            
            emailRecoverPassword({email, name, token:newToken});
            
            return {
                message: `An email has been sent to ${email}. Follow the instructions to recover your password.`
            };
            
        } catch (error) {
            const err = new Error("Recovey failed")
            err.status = 400;
            throw err;
        }
    };

    static comprobarToken = async({token})=>{

        const [resp, tableInfo] = await connection.query(
            `SELECT BIN_TO_UUID(id) as id, name, lastname, password, email, phone, token, confirm FROM users WHERE token = ?;`, [token]
        );

        if(resp.length === 0){
            const err = new Error("Invalid token")
            err.status = 400;
            throw err;
        }

        return {message: "Valid token and the user exists"};
    };

    static newPassword = async({token, password})=>{

        const [resp, tableInfo] = await connection.query(
             `SELECT BIN_TO_UUID(id) as id, name, lastname, password, email, phone, token, confirm FROM users WHERE token = ?;`, [token]
        );

        if(resp.length === 0){
            const err = new Error("Invalid token");
            err.status = 400;
            throw err;
        };

        const [{id}] = resp;
        const passwordHashed = await bcrypt.hash(password, parseInt(process.env.ROUNDS_SALT));

        try {
            
            const update = await connection.query(
                `
                UPDATE users 
                SET token = NULL, password = ?
                WHERE id = UUID_TO_BIN(?);
                `,[passwordHashed, id]
            );
            return {message:"password updated successfully"};

        } catch (error) {
            const err = new Error("Update password failed");
            err.status = 400;
            throw err;
        }

    }
    
}