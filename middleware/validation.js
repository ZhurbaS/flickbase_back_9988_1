const {check, validationResult} = require('express-validator');
const { status } = require('http-status');


const addArticleValidator = [
    check('title')
        .trim().not().isEmpty().withMessage('Вам потрібно вказати назву').bail()
        .isLength({min:3}).withMessage('Мінімум необхідно 3'),
    check('director')
        .trim().not().isEmpty().withMessage('Вам потрібно вказати директора').bail()
        .not().isBoolean().withMessage('Ви не можете вказувати булеві вирази').bail()
        .isLength({min:3,max:100}).withMessage('Перевірте довжину: мін. 3, макс. 100 знаків').bail(),
    (req,res,next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(status.BAD_REQUEST).json({
                errors: errors.array()
            });
        }
        next();
    }
]

module.exports = {
    addArticleValidator
}