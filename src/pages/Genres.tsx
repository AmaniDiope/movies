
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMovies } from "@/context/MovieContext";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { genres } from "@/types/movie";

const Genres = () => {
  const { genreName } = useParams<{ genreName?: string }>();
  const { movies } = useMovies();
  const [activeGenre, setActiveGenre] = useState<string | undefined>(genreName);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  
  // Get unique genres from all movies
  const uniqueGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.genre))
  ).sort();
  
  useEffect(() => {
    if (activeGenre) {
      setFilteredMovies(
        movies.filter((movie) =>
          movie.genre.some((g) => 
            g.toLowerCase() === activeGenre.toLowerCase()
          )
        )
      );
    } else {
      setFilteredMovies([]);
    }
  }, [activeGenre, movies]);
  
  useEffect(() => {
    if (genreName) {
      setActiveGenre(genreName);
    } else if (uniqueGenres.length > 0) {
      setActiveGenre(uniqueGenres[0]);
    }
  }, [genreName, uniqueGenres]);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Movies by Genre</h1>
        
        {/* Genre Tabs */}
        <div className="overflow-x-auto pb-4 mb-8">
          <div className="flex space-x-2">
            {uniqueGenres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap ${
                  activeGenre === genre
                    ? "bg-netflix-red text-white"
                    : "bg-netflix-lightgray text-gray-300 hover:bg-gray-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        
        {activeGenre && (
          <>
            <h2 className="text-2xl font-bold text-white mb-6">
              {activeGenre} Movies
            </h2>
            
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-netflix-darkgray rounded-lg">
                <h3 className="text-xl font-medium text-white mb-2">No movies found</h3>
                <p className="text-gray-400">
                  There are no movies in the {activeGenre} category.
                </p>
              </div>
            )}
          </>
        )}
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

export default Genres;
