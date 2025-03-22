import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"





function PaymentSuccessPage() {

  const navigate = useNavigate()

  return <Card className="p-10">
    <CardHeader className="p-0">
      <CardTitle className="text-3xl">
        Payment Successful!
      </CardTitle>
    </CardHeader>
    <Button
      onClick={() => navigate('/shop/account')}
      className="mt-5 w-50"
    >
      View Orders
    </Button>

  </Card>
}

export default PaymentSuccessPage