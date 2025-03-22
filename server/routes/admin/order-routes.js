const express=require('express')


const {
    getAllOrdersofAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus
}=require('../../controllers/admin/order-controller')

const router=express.Router()

router.get('/get',getAllOrdersofAllUsers)
router.get('/details/:id',getOrderDetailsForAdmin)
router.put('/update/:id',updateOrderStatus)

module.exports=router

