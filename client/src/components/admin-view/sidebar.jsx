import { Fragment } from "react"
import { Button } from "../ui/button"
import { ChartNoAxesCombined } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { adminSidebarMenuItems } from "@/config"
import { ArrowDownUp, BadgeCheck, LayoutDashboard, ShoppingBasket } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const iconMap = {
  "arrow-down-up": <ArrowDownUp />,
  "badge-check": <BadgeCheck />,
  "layout-dashboard": <LayoutDashboard />,
  "shopping-basket": <ShoppingBasket />,
  "chart-no-axes": <ChartNoAxesCombined />,

};

function MenuItems({setOpen}) {
  const navigate = useNavigate()
  return <nav className="mt-8 flex-col flex gap-2">
    {
      adminSidebarMenuItems.map(menuItem =>
        <div key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path)
            setOpen?setOpen(false):null
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {iconMap[menuItem.icon]}
          <span>{menuItem.label}</span>
        </div>)
    }
  </nav>

}



function AdminSideBar({ open, setOpen }) {

  const navigate = useNavigate()


  return <Fragment>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b">
            <SheetTitle className="flex gap-2 mt-5 mb-5">
              <ChartNoAxesCombined size={30} />
              <h1 className="text-2xl font-extrabold">Admin Panel</h1>
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen}/>
        </div>

      </SheetContent>
    </Sheet>
    <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
      <div className="flex cursor-pointer items-center gap-2">
        <ChartNoAxesCombined />
        <h1 className="text-2xl font-extrabold">Admin Panel</h1>
      </div>
      <MenuItems />
    </aside>
  </Fragment>
}

export default AdminSideBar