
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

        res.cookie("TokenSalud360", authUser ,{
            httpOnly:true,
            path:'/',
            secure:false,
            sameSite:'lax',
            maxAge: 1000 * 60 * 60 * 24 * 30,
        })

        res.json({message: "Successful login"})
        
    };

    profile = async(req, res)=>{
        res.json({...req.user});

    };

    logout = async(req, res)=>{

        res.cookie('TokenSalud360', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 0,
            path: '/'
        })

        res.json({message:"Successful logout"});
    }

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
    };

    newPassword = async(req, res)=>{
        const {token} = req.params;
        const {password} = req.body;

        const {message} = await this.usersModel.newPassword({token, password});

        res.json({message});
    };

    addProfilePhoto = async(req, res)=>{
        const {user:{id}} = req;
        const {file} = req

        const {url} = await this.usersModel.addProfilePhoto({id, file});
        
        res.json({result: {url, msg: "Successful update"}});
    }
}