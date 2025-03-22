import ProductDetailsDialog from "@/components/shopping-view/product-details"
import ShoppingProductTile from "@/components/shopping-view/product-tile"
import { Input } from "@/components/ui/input"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { fetchProductDetails } from "@/store/shop/products-slice"
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { toast } from "sonner"


function SearchProducts() {

    const [keyword, setKeyword] = useState('')
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const { searchResults } = useSelector(state => state.shopSearch)
    const { cartItems } = useSelector(state => state.shopCart)
    const { user } = useSelector(state => state.auth)
    const { productDetails } = useSelector(state => state.shopProducts)
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)

    useEffect(() => {
        if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword))
            }, 1000)
        } else {
            dispatch(resetSearchResults())
        }
    }, [keyword])

    useEffect(() => {
        if (productDetails !== null) {
          setOpenDetailsDialog(true)
        }
    
      }, [productDetails])

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

        dispatch(addToCart({
            userId: user?.id,
            productId: getCurrentProductId,
            quantity: 1
        }))
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

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId))
      }

    return <div className="container mx-auto md:px-6 px-4 py-8">
        <div className="flex justify-center mb-8">
            <div className="w-full flex items-center">
                <Input
                    value={keyword}
                    name="keyword"
                    className="py-6"
                    placeholder="Search Products..."
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {
                searchResults && searchResults.length ?
                    searchResults.map(item =>
                        <ShoppingProductTile
                            handleAddtoCart={handleAddtoCart}
                            handleGetProductDetails={handleGetProductDetails}
                            product={item} />
                    ) : <h1 className="text-2xl font-extrabold">No Result Found!</h1>
            }
        </div>
        <ProductDetailsDialog            
            open={openDetailsDialog}
            setOpen={setOpenDetailsDialog}
            productDetails={productDetails}
        />
    </div>
}

export default SearchProducts