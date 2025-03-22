const mongoose=require('mongoose')



const FeatureSchema=new mongoose.Schema({
    image: String,
},{timeStamps:true})

module.exports=mongoose.model('Feature',FeatureSchema)