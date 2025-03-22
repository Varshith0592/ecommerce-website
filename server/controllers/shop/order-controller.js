const paypal = require('../../helpers/paypal')
const Order = require('../../models/Order')
const Cart=require('../../models/Cart')
const Product=require('../../models/Product')



//Creating an order

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId
        } = req.body;

        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal',
            },
            redirect_urls: {
                return_url:` ${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map(item => ({
                            name: item.title,
                            sku: item.productId,
                            price: Number(item.price).toFixed(2),  // ✅ Fixed `.tofixed(2)`
                            currency: 'USD',
                            quantity: item.quantity
                        }))
                    },
                    amount: {
                        currency: 'USD',
                        total: Number(totalAmount).toFixed(2)  // ✅ Fixed `.tofixed(2)`
                    },
                    description: 'description'
                }
            ]
        };

        paypal.payment.create(create_payment_json, async (err, paymentInfo) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    success: false,
                    message: 'Error while creating payment',
                });
            } else {
                const newlyCreatedOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId
                });
                await newlyCreatedOrder.save();

                // ✅ Check if `paymentInfo.links` exists before `.find()`
                const approvalLink = paymentInfo.links?.find(link => link.rel === 'approval_url');
                
                if (!approvalLink) {
                    return res.status(400).json({
                        success: false,
                        message: 'Approval URL not found in PayPal response',
                    });
                }

                res.status(200).json({
                    success: true,
                    approvalURL: approvalLink.href,
                    orderId: newlyCreatedOrder._id
                });
            }
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Error creating order",
        });
    }
};



//Capturing Payment

const capturePayment = async (req, res) => {
    try {

        const {paymentId,payerId,orderId}=req.body

        let order=await Order.findById(orderId)

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }

        order.paymentStatus='paid'
        order.orderStatus='confirmed'
        order.paymentId=paymentId
        order.payerId=payerId


        for(let item of order.cartItems){
            let product=await Product.findById(item.productId) 

            if(!product){
                return res.status(404).json({
                    success: false,
                    message: `Not enough stock for this product ${product.title} `,
                })
            }

            product.totalStock-=item.quantity

            await product.save()
        }

        const getCartId=order.cartId
        const cart=await Cart.findByIdAndDelete(getCartId)


        await order.save()
        res.status(200).json({
            success: true,
            message: "Order Confirmed",
            data: order
        })
        

    } catch (e) {
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Error capturing payment",
        })
    }
}

//Fetching all orders

const getAllOrdersByUser=async(req,res)=>{
    try{

        const {userId}=req.params

        const orders=await Order.find({userId})

        if(!orders.length){
            return res.status(404).json({
                success: false,
                message: "No orders found",
            })
        }

        res.status(200).json({
            success: true,
            data: orders
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
        })
    }
}

//Fetching order details

const getOrderDetails=async(req,res)=>{
    try{
        const {id}=req.params

        const order=await Order.findById(id)

        if(!order){
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }

        return res.status(200).json({
            success: true,
            data: order
        })

    }catch(e){
        console.log(e)
        res.status(500).json({
            success: false,
            message: "Error fetching order details",
        })
    }
}


module.exports = { 
    createOrder, 
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
}