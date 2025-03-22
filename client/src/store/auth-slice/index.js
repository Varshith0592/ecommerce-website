import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"



const initialState={
    isAuthenticated:false,
    isLoading:true,
    user:null
}

export const registerUSer=createAsyncThunk('/auth/register',
    async(formData)=>{
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,
            formData,
            {
                withCredentials:true
            }
        )
        return response.data
    }
)


export const loginUser=createAsyncThunk('/auth/login',
    async(formData)=>{
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,
            formData,
            {
                withCredentials:true
            }
        )
        return response.data
    }
)

export const logoutUser=createAsyncThunk('/auth/logout',
    async()=>{
        const response=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`,{},
            {
                withCredentials:true
            }
        )
        return response.data
    }
)

export const checkAuth=createAsyncThunk('/auth/checkauth',
    async()=>{
        const response=await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,{
            withCredentials:true,
            headers:{
                'Cache-Control':'no-store,no-cache,must-revalidate,proxy-validate',
            }
            }
        )
        return response.data
    }
)



const authSlice=createSlice({
    name: 'auth',
    initialState,
    reducers:{
        setUser:(state,action)=>{

        }
    },
    extraReducers:(builder)=>{
        builder.addCase(registerUSer.pending,(state)=>{
            state.isLoading=true
        }).addCase(registerUSer.fulfilled,(state)=>{
            state.isLoading=false;
            state.user=null;
            state.isAuthenticated=false;
        }).addCase(registerUSer.rejected,(state)=>{
            state.isLoading=false;
            state.user=null;
            state.isAuthenticated=false;
        }).addCase(loginUser.pending,(state)=>{
            state.isLoading=true
        }).addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload.success?action.payload.user:null;
            state.isAuthenticated=action.payload.success?true:false;
        }).addCase(loginUser.rejected,(state)=>{
            state.isLoading=false;
            state.user=null;
            state.isAuthenticated=false;
        }).addCase(checkAuth.pending,(state)=>{
            state.isLoading=true
        }).addCase(checkAuth.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload.success?action.payload.user:null;
            state.isAuthenticated=action.payload.success?true:false;
        }).addCase(checkAuth.rejected,(state)=>{
            state.isLoading=false;
            state.user=null;
            state.isAuthenticated=false;
        }).addCase(logoutUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=null
            state.isAuthenticated=false;
        })
    }
})

export const {setUser}=authSlice.actions
export default authSlice.reducer;