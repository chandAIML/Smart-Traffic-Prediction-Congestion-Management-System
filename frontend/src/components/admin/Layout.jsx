import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import "../../styles/admin/layout.css";

export default function Layout({ children }) {

    return (

        <div className="layout">

            <div className="background">

                <div className="blob blob1"></div>

                <div className="blob blob2"></div>

                <div className="blob blob3"></div>

                <div className="grid"></div>

                <div className="noise"></div>

            </div>

            <Sidebar />

            <Topbar />

            <main className="content">

                {children}

            </main>

        </div>

    );

}