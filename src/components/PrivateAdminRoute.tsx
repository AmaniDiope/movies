import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactNode;
}

const PrivateAdminRoute: React.FC<Props> = ({ children }) => {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="bg-netflix-darkgray p-8 rounded shadow-xl text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You don't have permission to access the admin panel.</p>
          <a href="/" className="text-netflix-red hover:underline">Go Back Home</a>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default PrivateAdminRoute;
