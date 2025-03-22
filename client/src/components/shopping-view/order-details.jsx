import {
    DialogContent
} from "@/components/ui/dialog"
import React from 'react'
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { useSelector } from "react-redux"

function ShoppingOrderDetailsView({ orderDetails }) {

    const { user } = useSelector(state => state.auth)

    return (
        <DialogContent className="sm:max-w-[650px] p-6">
            <div className="max-h-[75vh] overflow-y-auto">
                <div className="grid gap-8">

                    {/* 🛠️ Order Info */}
                    <div className="grid gap-4">
                        <div className="text-lg font-semibold">Order Summary</div>
                        <div className="grid gap-4 bg-gray-50 p-4 rounded-lg shadow-sm border">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Order ID:</span>
                                <Label className="text-gray-700">{orderDetails?._id}</Label>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Order Date:</span>
                                <Label className="text-gray-700">
                                    {orderDetails?.orderDate?.split('T')[0]}
                                </Label>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Price:</span>
                                <Label className="text-gray-700">
                                    ${orderDetails?.totalAmount}
                                </Label>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Payment Method:</span>
                                <Label className="text-gray-700">
                                    {orderDetails?.paymentMethod}
                                </Label>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Payment Status:</span>
                                <Label className="text-gray-700">
                                    {orderDetails?.paymentStatus}
                                </Label>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Status:</span>
                                <Badge
                                    className={`py-1 px-4 rounded-full text-sm ${orderDetails?.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-orange-400'
                                        }`}
                                >
                                    {orderDetails?.orderStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* 🛠️ Order Items */}
                    <div className="grid gap-4">
                        <div className="text-lg font-semibold">Order Details</div>
                        <div className="grid gap-4">
                            {orderDetails?.cartItems?.length > 0 ? (
                                <ul className="grid gap-4">
                                    {orderDetails.cartItems.map((item, index) => (
                                        <li
                                            key={index}
                                            className="flex justify-between items-center p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow duration-300"
                                        >
                                            <div className="flex flex-col">
                                                <span className="text-md font-medium">{item?.title}</span>
                                                <span className="text-sm text-gray-500">Qty: {item?.quantity}</span>
                                            </div>
                                            <span className="text-md font-semibold">${item?.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="text-gray-500">No items found</div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* 🛠️ Shipping Info */}
                    <div className="grid gap-4">
                        <div className="text-lg font-semibold">Shipping Info</div>
                        <div className="grid gap-2 bg-gray-50 p-4 rounded-lg shadow-sm border">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Username:</span>
                                    <span className="text-gray-700">{user?.userName || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Address:</span>
                                    <span className="text-gray-700">{orderDetails?.addressInfo?.address || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">City:</span>
                                    <span className="text-gray-700">{orderDetails?.addressInfo?.city || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Pincode:</span>
                                    <span className="text-gray-700">{orderDetails?.addressInfo?.pincode || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Phone:</span>
                                    <span className="text-gray-700">{orderDetails?.addressInfo?.phone || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Notes:</span>
                                    <span className="text-gray-700">{orderDetails?.addressInfo?.notes || "No notes"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    )
}

export default ShoppingOrderDetailsView
