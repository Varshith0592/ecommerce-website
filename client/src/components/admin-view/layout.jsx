import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";




function AdminLayout(){


    const [open, setOpen] = useState(false);


    return (
        <div className="flex min-h-screen w-full">
            {/* Admin sidebar */}
            <AdminSideBar open={open} setOpen={setOpen} />
            <div className="flex flex-1 flex-col">
                {/* Admin header */}
                <AdminHeader setOpen={setOpen}/>
                <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout;