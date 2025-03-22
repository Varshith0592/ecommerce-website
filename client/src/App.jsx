import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/layout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminOrders from "./pages/admin-view/orders"
import AdminProducts from "./pages/admin-view/products"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./pages/not-found"
import ShoppingAccount from "./pages/shopping-view/account"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import ShoppingListing from "./pages/shopping-view/listing"
import CheckAuth from "./components/common/check-auth"
import UnauthPage from "./pages/unauth-page"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from "./pages/shopping-view/paypal-return"
import PaymentSuccessPage from "./pages/shopping-view/payment-success"
import SearchProducts from "./pages/shopping-view/search"



function App() {


  const {user,isAuthenticated,isLoading}=useSelector(state=>state.auth)
  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(checkAuth())
  },[dispatch])

  if(isLoading) return (
    <div className="fixed inset-0 bg-gray-200 z-50 flex items-center justify-center">
      <div className="w-full h-full max-w-screen-xl p-4">
        {/* Main Container for Skeleton Effect */}
        <div className="space-y-6">
          {/* Header Skeleton */}
          <Skeleton className="h-12 w-3/4 mx-auto" />

          {/* Card Skeleton */}
          <div className="flex flex-col space-y-6">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>

          {/* List Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route 
        path="/"
        element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
          </CheckAuth>
        }
        />
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />}/>
          <Route path="register" element={<AuthRegister />}/>
        </Route>
        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />}/>
          <Route path="products" element={<AdminProducts />}/>
        </Route>
        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="search" element={<SearchProducts />} />
          <Route path="home" element={<ShoppingHome />}/>
          <Route path="checkout" element={<ShoppingCheckout />}/>
          <Route path="listing" element={<ShoppingListing />}/>
          <Route path="account" element={<ShoppingAccount />}/>
          <Route path="paypal-return" element={<PaypalReturnPage />}/>
          <Route path="payment-success" element={<PaymentSuccessPage />}/>
          
        </Route>
        <Route path="*" element={<NotFound />}/>
        <Route path="/unauth-page" element={<UnauthPage />}/>
      </Routes>
    </div>
  )
}

export default App

