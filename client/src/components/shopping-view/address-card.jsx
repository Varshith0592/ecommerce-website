import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React from 'react'
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { useDispatch } from "react-redux"

function AddressCard({ 
    addressInfo,
    handleDeleteAddress,
    handleEditAddress,
    setCurrentSelectedAddress,
    selectedId
}) {

    return (
        <Card 
        onClick={()=>setCurrentSelectedAddress(addressInfo)}
        className={`cursor-pointer border-red-700 ${selectedId?._id===addressInfo?._id ? 'border-red-900 border-[3px]':'border-black'}`}
        >
            <CardContent className={`grid gap-4 p-4`}>
                <Label>Address: {addressInfo?.address}</Label>
                <Label>City: {addressInfo?.city}</Label>
                <Label>Pincode: {addressInfo?.pincode}</Label>
                <Label>Phone: {addressInfo?.phone}</Label>
                <Label>Notes: {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className="flex justify-between items-center px-5">
                <Button
                onClick={()=>handleEditAddress(addressInfo)}
                >
                    Edit
                </Button>
                <Button 
                onClick={()=>handleDeleteAddress(addressInfo)}
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    )
}

export default AddressCard