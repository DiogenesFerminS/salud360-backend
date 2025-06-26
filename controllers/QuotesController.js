
export class QuotesController {
    constructor ({QuotesModel}){
        this.quotesModel = QuotesModel;
    };

    addQuote = async(req, res)=>{
        const {name, lastname, email, phone, symptoms, date, hour_start, hour_end } = req.body;
        const quote = {
            name, 
            lastname, 
            email,
            phone, 
            symptoms,
            date,
            hour_start,
            hour_end,
            owner: req.user.id
        }

        const {message} = await this.quotesModel.addQuote({quote})

        res.json({message});
    }

    getQuotes = async(req, res)=>{

        const quotes = await this.quotesModel.getQuotes({owner:req.user.id})

        res.json(quotes);
    };

    getOneQuote = async(req, res) =>{

        const {id} = req.params;
        const {user} = req;
  
        const oneQuote = await this.quotesModel.getOneQuote({id, user});
        res.json({result: oneQuote});

    };

    updateQuote = async(req, res) =>{
        const {id} = req.params;
        const {user} = req;
        const {body} = req;

        const {message} = await this.quotesModel.updateQuote({id, user, body});
        res.json({message});

    };

    deleteQuote = async(req, res) =>{
        const {id} = req.params;
        const {user} = req;
        
        const {message} = await this.quotesModel.deleteQuote({id, user});

        res.json({message});

    }

}