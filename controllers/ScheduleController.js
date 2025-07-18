
export class ScheduleController {
    constructor ({ScheduleModel}){
        this.scheduleModel = ScheduleModel
    };

    getAll = async (req, res)=>{
        const {user} = req;
        const {id} = user;
        const resp = await this.scheduleModel.getAll({id});
        res.json(resp);
    };

    addAll = async (req, res)=>{
        const {user:{id}} = req;
        const {body} = req

        const resp = await this.scheduleModel.addAll({body,id});

        res.json({resp});
    }
}