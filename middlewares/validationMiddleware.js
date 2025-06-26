export const validationMiddleware = (schema, type)=>{
    return (req, res, next)=>{
        try {
            const data = type === 'body' ? req.body : req.params;
            const result = schema.parse(data);

            next();

        } catch (err) {
            console.log(err.issues);
            throw new Error(err.issues[0].message);
        };

    };
}