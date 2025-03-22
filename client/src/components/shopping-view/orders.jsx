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
import ShoppingOrderDetailsView from "./order-details"
import { Dialog } from "../ui/dialog"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice"
import { Badge } from "../ui/badge"




function ShoppingOrders() {

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { orderList,orderDetails } = useSelector(state => state.shopOrder)


  function handleFetchOrderDetails(getId){
    dispatch(getOrderDetails(getId))
  }


  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id))
  }, [dispatch])

  useEffect(()=>{
    if(orderDetails!==null){
      setOpenDetailsDialog(true)
    }
  },[orderDetails])

  return <Card>
    <CardHeader>
      <CardTitle>Order History</CardTitle>
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
                  className={`py-1 px-3 ${orderItem?.orderStatus==='delivered'?'bg-green-500':'bg-orange-400'}`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>${orderItem?.totalAmount}</TableCell>
                <TableCell>
                  <Dialog open={openDetailsDialog} onOpenChange={()=>{
                      setOpenDetailsDialog(false)
                      dispatch(resetOrderDetails())
                    }}>
                    <Button onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                      View Details
                    </Button>
                    <ShoppingOrderDetailsView 
                      orderDetails={orderDetails}
                    />
                  </Dialog>
                </TableCell>
              </TableRow>) : null
          }
        </TableBody>
      </Table>
    </CardContent>
  </Card>
}

export default ShoppingOrders