import DashboardLogo from "../general/dashlogo";
import AdminNavigation from "./nav";

export default function AsideView() {
    return (
        <aside className="bg-[#fff] w-[208px] fixed z-10 h-screen rounded-[10px] h-screen py-[26px] px-[15px] flex flex-col items-center gap-[179px] rounded-[10px] z-10">
            <DashboardLogo />
            <AdminNavigation />
        </aside>
    )
}