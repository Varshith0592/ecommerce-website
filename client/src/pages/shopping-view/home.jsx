import { Button } from '@/components/ui/button'
import {
  Shirt,
  User,
  Baby,
  Watch,
  Footprints,
  Check,
  Plus,
  Star,
  Tag,
  Sparkles,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { getFeatureImages } from '@/store/common-slice';

// Updated categories with relevant icons
const categoriesWithIcon = [
  { id: "men", label: "Men", icon: Shirt },           // Shirt for men's clothing
  { id: "women", label: "Women", icon: User },        // User (female silhouette) for women's clothing
  { id: "kids", label: "Kids", icon: Baby },          // Baby icon for kids
  { id: "accessories", label: "Accessories", icon: Watch },  // Watch for accessories
  { id: "footwear", label: "Footwear", icon: Footprints },   // Footprints for shoes
];

// Updated brands with more relevant icons/concepts
const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Check },         // Check (like Nike swoosh)
  { id: "adidas", label: "Adidas", icon: Plus },      // Plus (similar to Adidas stripes)
  { id: "puma", label: "Puma", icon: Star },          // Star for sporty feel
  { id: "levi", label: "Levi's", icon: Tag },         // Tag for denim/clothing
  { id: "zara", label: "Zara", icon: Sparkles },      // Sparkles for fashion
  { id: "h&m", label: "H&M", icon: Shirt },           // Shirt for clothing
];

// Rest of the code remains unchanged
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const { productList, productDetails } = useSelector(state => state.shopProducts)
  const { user } = useSelector(state => state.auth)
  const {featureImageList}=useSelector(state=>state.commonFeature)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem('filters')
    const currentFilter = {
      [section]: [getCurrentItem.id]
    }
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate('/shop/listing')
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
      .then(data => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id))
          toast('Product is added to cart', {
            style: {
              backgroundColor: '#4CAF50',
              color: 'white',
              fontSize: '16px',
              borderRadius: '8px',
              padding: '12px 24px',
            },
            duration: 3000,
          })
        }
      })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % featureImageList.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [featureImageList])

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({
      filterparams: {},
      sortParams: 'price-lowtohigh'
    }))
  }, [dispatch])

  useEffect(() => {
    if(productDetails!==null) {
      setOpenDetailsDialog(true)
    }
  },[productDetails])

  useEffect(() => {
    dispatch(getFeatureImages())
  },[dispatch])

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[750px] overflow-hidden">
        {
          featureImageList && featureImageList.length>0 ?
          featureImageList.map((slide, index) =>
            <img
              src={slide?.image}
              key={index}
              className={`${index == currentSlide ? 'opacity-100' : 'opacity-0'}
              absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
            />)
            :null
        }
        <Button variant="outline" size="icon"
          onClick={() => setCurrentSlide(prevSlide =>
            (prevSlide - 1 + featureImageList.length) % featureImageList.length
          )}
          className="absolute top-1/2 left-4 transform -translate-y-0.5 bg-white/80"
        >
          <ChevronLeftIcon className='w-4 h-4' />
        </Button>
        <Button variant="outline" size="icon"
          onClick={() => setCurrentSlide(prevSlide =>
            (prevSlide + 1 + featureImageList.length) % featureImageList.length
          )}
          className="absolute top-1/2 right-4 transform -translate-y-0.5 bg-white/80"
        >
          <ChevronRightIcon className='w-4 h-4' />
        </Button>
      </div>
      <section className='py-12 bg-gray-50'>
        <div className="container mx-auto px4">
          <h2 className='text-3xl font-bold text-center mb-8'>
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {
              categoriesWithIcon.map(categoryItem =>
                <Card
                  onClick={() => handleNavigateToListingPage(categoryItem, 'category')}
                  className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <categoryItem.icon className='w-12 h-12 mb-4 text-pr' />
                    <span className="font-bold">{categoryItem.label}</span>
                  </CardContent>
                </Card>)
            }
          </div>
        </div>
      </section>

      <section className='py-12 bg-gray-50'>
        <div className="container mx-auto px4">
          <h2 className='text-3xl font-bold text-center mb-8'>
            Shop by Brand
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {
              brandsWithIcon.map(brandItem => <Card
                onClick={() => handleNavigateToListingPage(brandItem, 'brand')}
                className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className='w-12 h-12 mb-4 text-pr' />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>)
            }
          </div>
        </div>
      </section>

      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <h2 className='text-3xl font-bold text-center mb-8'>
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {
              productList && productList.length > 0 ?
                productList.map(productItem =>
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    handleAddtoCart={handleAddtoCart}
                    product={productItem}
                  />)
                : null
            }
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  )
}

export default ShoppingHome