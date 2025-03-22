import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUSer } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"


const initialState={
    userName:'',
    email:'',
    password:'',
}



function AuthRegister(){

    const [formData,setFormData]=useState(initialState)
    const dispatch=useDispatch()
    const navigate=useNavigate()

    function onSubmit(event){
        event.preventDefault()
        dispatch(registerUSer(formData)).then((data)=>{
            if(data?.payload?.success){
                toast(data?.payload?.message, {
                    style: {
                      backgroundColor: '#4CAF50', // Green background
                      color: 'white',
                      fontSize: '16px',
                      borderRadius: '8px',
                      padding: '12px 24px',
                    },
                    duration: 5000, // Show for 5 seconds
                  })
            
                navigate('/auth/login')
            }else{
                toast(data?.payload?.message, {
                    style: {
                        backgroundColor: '#FF0000', // Red background
                        color: 'white',
                        fontSize: '16px',
                        borderRadius: '8px',
                        padding: '12px 24px',
                    },
                    duration: 5000, // Show for 5 seconds
                })      
            }   
        }
        )
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
                <p className="mt-2">Already have an account?
                    <Link className="font-medium ml-2 text-primary hover:underline" to='/auth/login'>Login</Link>
                </p>
            </div>
            <CommonForm 
            formControls={registerFormControls}
            buttonText={'Sign Up'}
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            />
        </div>
    )
}

export default AuthRegister;