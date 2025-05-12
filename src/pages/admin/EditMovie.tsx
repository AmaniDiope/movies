
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMovies } from "@/context/MovieContext";
import Navbar from "@/components/Navbar";
import MovieForm from "@/components/admin/MovieForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EditMovie = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { getMovieById } = useMovies();
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  const movie = getMovieById(id!);
  
  if (!movie) {
    return <Navigate to="/admin" />;
  }
  
  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-netflix-darkgray border-none shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-white">
              Edit Movie: {movie.title}
            </CardTitle>
            <Button
              variant="outline"
              asChild
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <a href={`/movie/${id}`} target="_blank" rel="noopener noreferrer">
                View Movie
              </a>
            </Button>
          </CardHeader>
          <CardContent>
            <MovieForm mode="edit" movieId={id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditMovie;
