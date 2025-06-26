
export class UsersController{
    
    constructor ({UsersModel}){
        this.usersModel = UsersModel;
    };

    register = async(req, res)=>{

        const {body} = req
        const newUser = await this.usersModel.register({input: body});

        res.json({profile: newUser});
    };

    login = async(req, res)=>{
        const {body} = req;

        const authUser = await this.usersModel.login({input:body});

        res.json({JWT: authUser})
    };

    profile = async(req, res)=>{

        res.json({user: req.user});
        
    };

    confirm = async(req, res)=>{
        const {token} = req.params;

        const userConfirm = await this.usersModel.confirm({token});

        res.json({user:userConfirm});
    };

    recoverPassword = async(req, res)=>{
        const {body} = req;

        const {email} = body;

        const {message} = await this.usersModel.recoverPassword({email})

        res.json({message});

    };

    comprobarToken = async(req, res)=>{
        const {token} = req.params;

        const {message} = await this.usersModel.comprobarToken({token});

        res.json({message});
    }

    newPassword = async(req, res)=>{
        const {token} = req.params;
        const {password} = req.body;

        const {message} = await this.usersModel.newPassword({token, password});

        res.json({message});
    }
}