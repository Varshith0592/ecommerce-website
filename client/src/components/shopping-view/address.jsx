import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CommonForm from "../common/form"
import { useEffect, useState } from "react"
import { addressFormControls } from "@/config"
import { useDispatch, useSelector } from "react-redux"
import { addNewAddress, deleteAddress, editAddress, fetchAllAddresses } from "@/store/shop/address-slice"
import AddressCard from "./address-card"
import { toast } from "sonner"



const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
}


function Address({setCurrentSelectedAddress,selectedId}) {

    const [formData, setFormData] = useState(initialAddressFormData)
    const [currentEditedId,setCurrentEditedId]=useState(null)
    const dispatch=useDispatch()
    const {user}=useSelector(state=>state.auth)
    const {addressList}=useSelector(state=>state.shopAddress)

    function handleManageAddress(event) {
        event.preventDefault()
        if(addressList.length>=3 && currentEditedId==null){
            toast.error('You can have maximum of 3 addresses only',{
                style: {
                    backgroundColor: '#FF0000', // Red background
                    color: 'white',
                    fontSize: '16px',
                    borderRadius: '8px',
                    padding: '12px 24px',
                },
                duration: 2000, // Show for 2 seconds
            })
            setFormData(initialAddressFormData)
            return
        }
        currentEditedId?
        dispatch(editAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData:formData,
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setCurrentEditedId(null)
                setFormData(initialAddressFormData)
                toast('Address updated successfully',{
                    style: {
                      backgroundColor: '#4CAF50', // Green background
                      color: 'white',
                      fontSize: '16px',
                      borderRadius: '8px',
                      padding: '12px 24px',
                    },
                    duration: 2000, // Show for 2 seconds
                  })
                
            }
        })
        :dispatch(addNewAddress({
            ...formData,
            userId: user?.id
        })).then(data=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setFormData(initialAddressFormData)
                toast('Address added successfully',{
                    style: {
                      backgroundColor: '#4CAF50', // Green background
                      color: 'white',
                      fontSize: '16px',
                      borderRadius: '8px',
                      padding: '12px 24px',
                    },
                    duration: 2000, // Show for 2 seconds
                  })
            }
        })
    }

    function isFormValid(){
        return Object.keys(formData)
        .map(key=>formData[key].trim()!=='')
        .every((item)=>item)
    }


    function handleDeleteAddress(getCurrentAddress){
        dispatch(deleteAddress({userId: user?.id, addressId:getCurrentAddress._id}))
        .then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                toast('Address Deleted Successfully', {
                    style: {
                        backgroundColor: '#FF0000', // Red background
                        color: 'white',
                        fontSize: '16px',
                        borderRadius: '8px',
                        padding: '12px 24px',
                    },
                    duration: 2000, // Show for 2 seconds
                })    
            }
        })
    }

    function handleEditAddress(getCurrentAddress){
        setCurrentEditedId(getCurrentAddress?._id)
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes
        })
    }

    useEffect(()=>{
        dispatch(fetchAllAddresses(user?.id))
    },[dispatch])

    


    return <Card>
        <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {
                addressList && addressList.length>0?
                addressList.map(singleAddressItem=>
                    <AddressCard
                    selectedId={selectedId} 
                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                    addressInfo={singleAddressItem}
                    handleDeleteAddress={handleDeleteAddress}
                    handleEditAddress={handleEditAddress}
                    />
                )
                :null
            }
        </div>
        <CardHeader>
            <CardTitle className="text-2xl font-bold">
                {
                    currentEditedId?'Edit Address':'Add New Address'
                }
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={ currentEditedId?'Edit':'Add'}
                onSubmit={handleManageAddress}
                isBtnDisabled={!isFormValid()}
            />
        </CardContent>
    </Card>
}

export default Address