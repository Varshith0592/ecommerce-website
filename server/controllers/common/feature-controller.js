const Feature=require('../../models/Feature')

const addFeatureImage=async(req,res)=>{
    try{
        const {image}=req.body

        const featureImages=new Feature({
            image
        })

        await featureImages.save()

        res.status(200).json({
            success:true,
            data: featureImages

        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:"Error occured while adding featured images"
        })
    }
}


const getFeatureImages=async(req,res)=>{
    try{

        const images=await Feature.find({})

        res.status(200).json({
            success:true,
            data:images
        })
    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:"Error occured while fetching featured images"
        })
    }
}

module.exports={
    addFeatureImage,
    getFeatureImages
}