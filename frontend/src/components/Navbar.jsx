import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useCart } from "../context/CartContext"; // <-- IMPORT CUSTOM HOOK

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const { cartCount } = useCart(); // <-- DAPATKAN JUMLAH ITEM DARI CONTEXT

	return (
		<nav className="bg-white shadow-md sticky top-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex justify-between items-center py-4">
					<Link to="/" className="text-2xl font-bold text-gray-800">
						TokoKita
					</Link>

					<div className="hidden md:flex items-center space-x-6">
						<Link to="/" className="text-gray-600 hover:text-blue-500">
							Home
						</Link>
					</div>

					<div className="flex items-center space-x-4">
						<Link
							to="/cart"
							className="relative text-gray-600 hover:text-blue-500"
						>
							<ShoppingCart size={24} />
							{cartCount > 0 && (
								<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
									{cartCount}
								</span>
							)}
						</Link>
						<Link to="/login" className="text-gray-600 hover:text-blue-500">
							<User size={24} />
						</Link>
						<div className="md:hidden">
							<button onClick={() => setIsOpen(!isOpen)}>
								{isOpen ? <X size={24} /> : <Menu size={24} />}
							</button>
						</div>
					</div>
				</div>
			</div>

			{isOpen && (
				<div className="md:hidden bg-white pb-4">
					<Link
						to="/"
						className="block py-2 px-4"
						onClick={() => setIsOpen(false)}
					>
						Home
					</Link>
				</div>
			)}
		</nav>
	);
}

export default Navbar;
