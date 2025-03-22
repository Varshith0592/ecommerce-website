import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { Dialog } from "../ui/dialog"
import { useEffect, useState } from "react"
import AdminOrderDetailsView from "./order-details"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetailsForAdmin } from "@/store/admin/order-slice"
import { Badge } from "../ui/badge"




function AdminOrdersComponent() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const { orderList, orderDetails } = useSelector(state => state.adminOrder)
    const dispatch = useDispatch()

    function handleFetchOrderDetails(getId){
        dispatch(getOrderDetailsForAdmin(getId))
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin())
    }, [dispatch])

    useEffect(()=>{
        if(orderDetails!==null)
            setOpenDetailsDialog(true)
    },[orderDetails])


    return <Card>
        <CardHeader>
            <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Id</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Order Price</TableHead>
                        <TableHead>
                            <span className="sr-only">Details</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        orderList && orderList.length > 0 ?
                            orderList.map(orderItem => <TableRow>
                                <TableCell>{orderItem?._id}</TableCell>
                                <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`py-1 px-3 ${orderItem?.orderStatus === 'delivered' ? 'bg-green-500' : 'bg-orange-300'}`}
                                    >
                                        {orderItem?.orderStatus}
                                    </Badge>
                                </TableCell>
                                <TableCell>${orderItem?.totalAmount}</TableCell>
                                <TableCell>
                                    <Dialog open={openDetailsDialog} 
                                        onOpenChange={() => {
                                        setOpenDetailsDialog(false)
                                        dispatch(resetOrderDetailsForAdmin())
                                    }}
                                    >
                                        <Button 
                                        onClick={() => handleFetchOrderDetails(orderItem?._id)}
                                        >
                                            View Details
                                        </Button>
                                        <AdminOrderDetailsView
                                            orderDetails={orderDetails}
                                        />
                                    </Dialog>
                                </TableCell>
                            </TableRow>) : null}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
}

export default AdminOrdersComponent