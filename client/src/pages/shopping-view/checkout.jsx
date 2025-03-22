import Address from "@/components/shopping-view/address"
import UserCartItemsContent from "@/components/shopping-view/cart-items-content"
import { Button } from "@/components/ui/button";
import { createNewOrder } from "@/store/shop/order-slice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"



function ShoppingCheckout() {

  const { cartItems } = useSelector(state => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const { approvalURL } = useSelector(state => state.shopOrder)
  const dispatch = useDispatch()
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart, setIsPaymentStart] = useState(false)

  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0
    ? cartItems.items.reduce((sum, currentItem) =>
      sum + ((currentItem?.salePrice > 0 ? currentItem?.salePrice
        : currentItem?.price) * currentItem?.quantity), 0)
    : 0;

  function handleInitiatePaypalPayment() {

    if(cartItems.length==0){
      toast.error('Your cart is empty!', {
        style: {
          backgroundColor: '#FF0000', // Red background
          color: 'white',
          fontSize: '16px',
          borderRadius: '8px',
          padding: '12px 24px',
        },
        duration: 2000, // Show for 2 seconds
      })
      return
    }

    if (currentSelectedAddress == null) {
      toast.error('Please Select one address to proceed', {
        style: {
          backgroundColor: '#FF0000', // Red background
          color: 'white',
          fontSize: '16px',
          borderRadius: '8px',
          padding: '12px 24px',
        },
        duration: 2000, // Show for 2 seconds
      })
      return
    }
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map(singleCartItem => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
        quantity: singleCartItem?.quantity
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes
      },
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: ''
    }

    dispatch(createNewOrder(orderData)).then((data) => {
      console.log(data)
      if (data?.payload?.success) {
        setIsPaymentStart(true)
      } else {
        setIsPaymentStart(false)
      }
    })
  }

  if (approvalURL) {
    window.location.href = approvalURL
  }



  return <div className="flex flex-col">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
      <Address
      selectedId={currentSelectedAddress}
      address={currentSelectedAddress}
      setCurrentSelectedAddress={setCurrentSelectedAddress} 
      />
      <div className="flex flex-col gap-4">
        {
          cartItems && cartItems.items && cartItems.items.length > 0 ?
            cartItems.items.map(cartItem =>
              <UserCartItemsContent cartItem={cartItem} />
            ) : null
        }
        <div className="mt-8 space-y-4 px-4">
          <div className="flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-bold">
              ${totalCartAmount}</span>
          </div>
        </div>
        <div className="mt-4 w-full">
          <Button
            onClick={handleInitiatePaypalPayment}
            className="w-full cursor-pointer"
          >
            {
              isPaymentStart? 'Processing your payment....':'Checkout with Paypal'
            }
          </Button>
        </div>
      </div>
    </div>
  </div>
}

export default ShoppingCheckout