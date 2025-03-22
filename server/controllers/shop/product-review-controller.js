const ProductReview=require("../../models/Review")
const Order=require('../../models/Order')
const Product=require('../../models/Product')





const addProductReview=async(req,res)=>{
    try{

        const{
            productId,
            userId,
            userName,
            reviewMessage,
            reviewValue
        }=req.body

        const order=await Order.findOne({
            userId,
            "cartItems.productId":productId,
            orderStatus: 'confirmed'
        })

        if(!order){
            return res.status(404).json({
                success:false,
                message:"Ypu need to purchase product to review it"
            })
        }

        const checkExistingReview=await ProductReview.findOne({
            productId,
            userId
        })

        if(checkExistingReview){
            return res.status(400).json({
                success:false,
                message:"You already reviewed this product"
            })
        }

        const newReview=new ProductReview({
            productId,
            userId,
            userName,
            reviewMessage,
            reviewValue
        })

        await newReview.save()

        const reviews=await ProductReview.find({productId})

         res.status(201).json({
            success:true,
            data: newReview
         })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:"Error while adding review"
        })
    }
}



const getProductReviews=async(req,res)=>{
    try{

        const{
            productId
        }=req.params

        const reviews=await ProductReview.find({productId})
        res.status(200).json({
            success:true,
            data:reviews
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success:false,
            message:"Error while getting reviews"
        })
    }
}


module.exports={
    addProductReview,
    getProductReviews
}