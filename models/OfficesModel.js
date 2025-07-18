import db from "../db/connection.js";

export class OfficesModel {

    static getAll = async ({user}) => {
        const {id} = user;

        try {
            const [offices] = await db.query(
            `SELECT BIN_TO_UUID(id) as id , name, office_address, city, phone FROM offices WHERE doctor_id = UUID_TO_BIN(?);`,
            [id]
            );

            return offices;

        } catch (error) {
            const err = new Error("Failed to query offices")
            err.status = 404;
            throw err;
        }
        
    };

    static addOffice = async({user, office})=>{
        const { id } = user;
        const {name, office_address, city, phone} = office;

        const [offices] = await db.query(
            `SELECT BIN_TO_UUID(id) as id , name, office_address, city, phone FROM offices WHERE doctor_id = UUID_TO_BIN(?);`,
            [id]
        );

        if(offices.length >= 3){
            const error = new Error("office limit reached");
            error.status = 404;
            throw error;
        }

        const uuidResult = await db.query(
            `SELECT UUID() as uuid;`
        );

        const [{uuid}] = uuidResult[0];

        try {
            const result = await db.query(
            `INSERT INTO offices (id, doctor_id, name, office_address,city, phone) 
            VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?);
            `, [uuid, id, name, office_address, city, phone]
            );

            return {
                message:"Office created successfully",
                newOffice: {
                    id: uuid,
                    name,
                    office_address,
                    city,
                    phone
                },
            };

        } catch (error) {
            const err = new Error("Created office failed");
            err.status = 403;
            throw err;        
        }
    
    };

    static deteleOffice = async({user, id})=>{
        let office;

        try {
            const [resp, info] = await db.query(
                `SELECT BIN_TO_UUID(id) as id, BIN_TO_UUID(doctor_id) as doctor_id, name, office_address, city, phone
                FROM offices WHERE id = UUID_TO_BIN(?);
                `, [id]
            );
            
            office = resp;

        } catch (error) {
            const err = new Error("Invalid id");
            err.status = 404;
            throw err;
        };

        if(office.length === 0){
            const err = new Error("Office not found");
            err.status = 404;
            throw err;
        };

        if(office[0].doctor_id !== user.id){
            const err = new Error("Access denied");
            err.status = 401;
        }

        try {
            const resp = await db.query(
                `DELETE FROM offices WHERE id = UUID_TO_BIN(?)`,[id]
            );

            return {message: "Delete success"};
        } catch (error) {
            console.log(error);
            const err = new Error("Delete failed");
            err.status = 404;
            throw err;
        }

        
         

        return {message: "OK"};
    }
}