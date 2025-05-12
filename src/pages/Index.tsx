
import React from "react";
import { useMovies } from "@/context/MovieContext";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { movies, featuredMovies } = useMovies();

  // Get unique genres
  const allGenres = Array.from(
    new Set(movies.flatMap((movie) => movie.genre))
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />

      {/* Hero Section with Featured Movie */}
      {featuredMovies.length > 0 && (
        <div className="relative h-[70vh] mb-8">
          <div className="absolute inset-0">
            <img
              src={featuredMovies[0].imageUrl}
              alt={featuredMovies[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-netflix-black to-transparent" />
          </div>
          <div className="relative h-full flex items-end pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                {featuredMovies[0].title}
              </h1>
              <p className="text-lg text-gray-300 mb-6 line-clamp-3">
                {featuredMovies[0].description}
              </p>
              <div className="flex space-x-4">
                <Link to={`/movie/${featuredMovies[0].id}`}>
                  <Button variant="destructive" className="px-6 py-2">
                    Watch Now
                  </Button>
                </Link>
                <Button variant="outline" className="px-6 py-2 border-gray-600">
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Featured Movies Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Movies</h2>
            <Link to="/movies" className="text-gray-400 flex items-center hover:text-white">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {featuredMovies.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        {allGenres.map((genre) => (
          <section key={genre} className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{genre}</h2>
              <Link
                to={`/genres/${genre.toLowerCase()}`}
                className="text-gray-400 flex items-center hover:text-white"
              >
                See All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies
                .filter((movie) => movie.genre.includes(genre))
                .slice(0, 5)
                .map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
          </section>
        ))}
      </div>
      
      {/* Footer */}
      <footer className="bg-netflix-darkgray py-8 text-center text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2025 MovieFlix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
