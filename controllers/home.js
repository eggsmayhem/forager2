module.exports = {
    getIndex: (req,res)=>{
        res.render('index.ejs')
    },
    getFaq: (req, res) => {
        res.render('faq.ejs')
    }
}