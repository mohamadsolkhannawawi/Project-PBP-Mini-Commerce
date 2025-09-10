import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Navbar />
			<main className="flex-grow container mx-auto p-4">
				<Outlet /> {/* Ini adalah tempat konten halaman akan ditampilkan */}
			</main>
			<Footer />
		</div>
	);
}

export default MainLayout;
