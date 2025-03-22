import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth-slice'
import AdminProductsSlice from './admin/products-slice'
import shoppingProductsSlice from './shop/products-slice'
import shoppingCartSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from './shop/order-slice'
import adminOrderSlice from './admin/order-slice'
import shopSearchSlice from './shop/search-slice'
import shopReviewSlice from './shop/review-slice'
import commonFeatureSlice from './common-slice'

const store=configureStore({
    reducer:{
        auth:authReducer,
        adminProducts: AdminProductsSlice,
        shopProducts: shoppingProductsSlice,
        shopCart: shoppingCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        adminOrder: adminOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview:shopReviewSlice,
        commonFeature:commonFeatureSlice
    }
})

export default store