
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MovieForm from "@/components/admin/MovieForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AddMovie = () => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-netflix-darkgray border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              Add New Movie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MovieForm mode="add" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddMovie;
