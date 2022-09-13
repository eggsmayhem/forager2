module.exports = {
    getPlants: async (req,res)=>{
        console.log(req.user)
        try{
            const plants =
            // const todoItems = await Todo.find({userId:req.user.id})
            // const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.render('plants.ejs', { user: req.user})
        }catch(err){
            console.log(err)
        }
    },
}    