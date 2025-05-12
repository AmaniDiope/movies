
import React from "react";
import { useMovies } from "@/context/MovieContext";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";

const Movies = () => {
  const { movies } = useMovies();

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">All Movies</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-netflix-darkgray py-8 text-center text-gray-400 mt-8">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2025 MovieFlix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Movies;
