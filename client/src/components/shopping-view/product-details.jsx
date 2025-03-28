
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { StarIcon } from "lucide-react"
import { Input } from "../ui/input"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { setProductDetails } from "@/store/shop/products-slice"
import { Label } from "../ui/label"
import StarRatingComponent from "../common/star-rating"
import { useEffect, useState } from "react"
import { addReview, getReviews } from "@/store/shop/review-slice"





function ProductDetailsDialog({ open, setOpen, productDetails }) {

    const [reviewMsg, setReviewMsg] = useState("")
    const [rating, setRating] = useState(0)
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.shopCart)
    const { user } = useSelector(state => state.auth)
    const { reviews } = useSelector(state => state.shopReview)

    function handleRatingChange(getRating) {
        setRating(getRating)
    }

    function handleAddtoCart(getCurrentProductId, getTotalStock) {

        let getCartItems = cartItems.items || []

        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity
                if (getQuantity + 1 > getTotalStock) {
                    toast(`Only ${getQuantity} can be added`, {
                        style: {
                            backgroundColor: '#FF0000', // Red background
                            color: 'white',
                            fontSize: '16px',
                            borderRadius: '8px',
                            padding: '12px 24px',
                        },
                        duration: 3000,
                    })
                    return
                }
            }

        }
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
            .then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id))
                    toast('Product is added to cart', {
                        style: {
                            backgroundColor: '#4CAF50', // Green background
                            color: 'white',
                            fontSize: '16px',
                            borderRadius: '8px',
                            padding: '12px 24px',
                        },
                        duration: 3000, // Show for 3 seconds
                    }
                    )
                }
            })
    }

    function handleDialogClose() {
        setOpen(false)
        dispatch(setProductDetails())
        setRating(0)
        setReviewMsg("")
    }

    function handleAddReview() {
        dispatch(addReview({
            productId: productDetails?._id,
            userId: user?.id,
            userName: user?.userName,
            reviewMessage: reviewMsg,
            reviewValue: rating
        })).then((data) => {
            if (data.payload.success) {
                setRating(0)
                setReviewMsg('')
                dispatch(getReviews(product?._id))
                toast('Review Added Successfully!', {
                    style: {
                        backgroundColor: '#4CAF50', // Green background
                        color: 'white',
                        fontSize: '16px',
                        borderRadius: '8px',
                        padding: '12px 24px',
                    },
                    duration: 3000, // Show for 3 seconds
                })
            }
        })
    }

    useEffect(() => {
        if (productDetails !== null)
            dispatch(getReviews(productDetails?._id))
    }, [productDetails])


    const totalReviewsLength = reviews.length
    const averageReview = reviews.reduce(
        (sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength


    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div className="">
                    <div className="">
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">
                            {productDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-self-start gap-2">
                        <p className={`${productDetails?.salePrice > 0 ? 'line-through' : ''} 
                    text-3xl font-bold text-primary`}
                        >
                            ${productDetails?.price}
                        </p>
                        {
                            productDetails?.salePrice > 0 ?
                                <p className="text-3xl font-bold text-muted-foreground">${productDetails?.salePrice}</p>
                                : null
                        }
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <StarRatingComponent rating={averageReview} />
                        <span className="text-muted-foreground">({averageReview})</span>
                    </div>
                    <div className="mt-5 mb-5">
                        {
                            productDetails?.totalStock === 0 ?
                                <Button
                                    className="w-full opacity-60 cursor-not-allowed"
                                >
                                    Out Of Stock
                                </Button>
                                :
                                <Button
                                    className="w-full"
                                    onClick={() => handleAddtoCart(productDetails?._id, productDetails?.totalStock)}
                                >
                                    Add To Cart
                                </Button>
                        }

                    </div>
                    <Separator />
                    <div className="max-h-[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">
                            Reviews
                        </h2>
                        <div className="grid gap-6">
                            {
                                reviews && reviews.length > 0 ?
                                    reviews.map(reviewItem =>
                                        <div className="flex gap-4">
                                            <Avatar className="w-10 h-10 border">
                                                <AvatarFallback>
                                                    {reviewItem?.userName[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold">
                                                        {reviewItem?.userName}
                                                    </h3>
                                                </div>
                                                <div className="flex items-center gap-0.5">
                                                    <StarRatingComponent rating={reviewItem?.reviewValue} />
                                                </div>
                                                <p className="text-muted-foreground">{reviewItem.reviewMessage}</p>
                                            </div>
                                        </div>
                                    ) : <h1>No Reviews!</h1>
                            }

                        </div>
                        <div className="mt-10 flex flex-col gap-2">
                            <Label>Write a review</Label>
                            <div className="flex">
                                <StarRatingComponent
                                    rating={rating}
                                    handleRatingChange={handleRatingChange}
                                />
                            </div>
                            <Input
                                name="reviewMsg"
                                value={reviewMsg}
                                onChange={(event) => setReviewMsg(event.target.value)}
                                placeholder="Please write a review.."
                            />
                            <Button
                                onClick={handleAddReview}
                                disabled={reviewMsg.trim() === ""}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialog