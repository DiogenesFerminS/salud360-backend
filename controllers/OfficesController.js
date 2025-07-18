
export class OfficesController {

    constructor ({OfficesModel}){
        this.officesModel = OfficesModel;
    }

    getAll = async(req, res)=>{
        const {user} = req;
        const results = await this.officesModel.getAll({user});
        
        res.json({results});
    }

    addOffice = async(req, res)=>{
        const {user} = req;
        const {name, office_address, city, phone} = req.body;

        const office = {
            name,
            office_address,
            city,
            phone,
        };

        const {message, newOffice} = await this.officesModel.addOffice({user, office});
 
        res.json({results:{message,newOffice}});
    };

    deleteOffice = async(req, res)=>{
        const {id} = req.params;
        const {user} = req;

        const message = await this.officesModel.deteleOffice({user, id});

        res.json(message);
    }
}