
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-netflix-black sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-netflix-red text-2xl font-bold">MovieFlix</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link to="/" className="px-3 py-2 text-gray-300 hover:text-white">
                Home
              </Link>
              <Link to="/movies" className="px-3 py-2 text-gray-300 hover:text-white">
                Movies
              </Link>
              <Link to="/genres" className="px-3 py-2 text-gray-300 hover:text-white">
                Genres
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch} className="relative mr-4">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-netflix-lightgray text-white border-none placeholder:text-gray-400 focus-visible:ring-netflix-red"
                />
                <Button 
                  type="submit" 
                  variant="ghost"
                  className="absolute right-0 text-gray-400 hover:text-white"
                >
                  <Search size={20} />
                </Button>
              </div>
            </form>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" className="mr-2 border-gray-600 hover:text-netflix-red">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button variant="destructive" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="destructive">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <form onSubmit={handleSearch} className="relative mr-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 bg-netflix-lightgray text-white border-none placeholder:text-gray-400 focus-visible:ring-netflix-red"
              />
              <Button 
                type="submit" 
                variant="ghost"
                className="absolute right-0 top-0 bottom-0 text-gray-400 hover:text-white"
              >
                <Search size={16} />
              </Button>
            </form>
            <button
              onClick={toggleMenu}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-netflix-darkgray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-300 hover:text-white"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className="block px-3 py-2 text-gray-300 hover:text-white"
              onClick={toggleMenu}
            >
              Movies
            </Link>
            <Link
              to="/genres"
              className="block px-3 py-2 text-gray-300 hover:text-white"
              onClick={toggleMenu}
            >
              Genres
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-gray-300 hover:text-white"
                    onClick={toggleMenu}
                  >
                    Admin Panel
                  </Link>
                )}
                <Button
                  variant="destructive"
                  className="w-full mt-2"
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link
                to="/login"
                className="block"
                onClick={toggleMenu}
              >
                <Button variant="destructive" className="w-full mt-2">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
