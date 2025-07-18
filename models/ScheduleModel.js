
import db from "../db/connection.js";

export class ScheduleModel{

    static getAll = async({id})=>{

        try {
        const [res, info] = await db.query(
        `SELECT BIN_TO_UUID(id), BIN_TO_UUID(doctor_id), day_of_week, hour FROM schedules WHERE doctor_id = UUID_TO_BIN(?)`, [id]
        );

        return res;
        } catch (error) {
            const err = new Error("Failed to query offices");
            err.status = 404;
            throw err;
        };

    };

    static addAll = async({body, id})=>{

        try {
            const results = await Promise.all(
                body.map( async slot => {
                    try {
                        const [result, tableInfo] = await db.query(
                            `INSERT INTO schedules (doctor_id, office_id, day_of_week, hour) 
                            VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)
                            `,[id,slot.office_id, slot.day, slot.hour]
                        );

                        return {success:true, result };
                        
                    } catch (error) {
                        return {success: false, error:error.message};      
                    };
                })
            );

            const failedUpdates = results.filter(r => !r.success);

            if(failedUpdates.length > 0){
                return{
                    message:"Some update failed",
                    successCount: results.length - failedUpdates.length,
                    failedUpdates,
                    success: false,
                };
            };

            return {
                success:true,
                updatedCount: results.length,
            }
          

        } catch (error) {
            const err = new Error("Failed add schedule");
            err.status = 404;
            throw error;
        }
    }


}