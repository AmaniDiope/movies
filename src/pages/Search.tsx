
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useMovies } from "@/context/MovieContext";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { genres } from "@/types/movie";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  const location = useLocation();
  const { movies } = useMovies();
  const [searchResults, setSearchResults] = useState(movies);
  const [query, setQuery] = useState("");
  
  // Filters
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState([1950, new Date().getFullYear()]);
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get("q") || "";
    setQuery(q);
    applyFilters(q, selectedGenres, yearRange, minRating);
  }, [location.search]);

  const applyFilters = (
    searchQuery: string, 
    genres: string[], 
    years: number[], 
    rating: number
  ) => {
    let results = movies;
    
    // Apply text search
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        (movie) =>
          movie.title.toLowerCase().includes(lowerCaseQuery) ||
          movie.description.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply genre filter
    if (genres.length > 0) {
      results = results.filter((movie) =>
        movie.genre.some((g) => genres.includes(g))
      );
    }
    
    // Apply year range filter
    results = results.filter(
      (movie) => movie.releaseYear >= years[0] && movie.releaseYear <= years[1]
    );
    
    // Apply rating filter
    if (rating > 0) {
      results = results.filter((movie) => movie.rating >= rating);
    }
    
    setSearchResults(results);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(query, selectedGenres, yearRange, minRating);
  };
  
  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((g) => g !== genre)
        : [...prev, genre]
    );
  };
  
  const resetFilters = () => {
    setSelectedGenres([]);
    setYearRange([1950, new Date().getFullYear()]);
    setMinRating(0);
    setQuery("");
    setSearchResults(movies);
  };
  
  useEffect(() => {
    applyFilters(query, selectedGenres, yearRange, minRating);
  }, [selectedGenres, yearRange, minRating]);

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 bg-netflix-darkgray p-4 rounded-lg h-fit">
            <h2 className="text-xl font-bold text-white mb-4">Filters</h2>
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="flex items-center">
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
                />
                <Button type="submit" variant="ghost" className="ml-2">
                  <SearchIcon size={20} />
                </Button>
              </div>
            </form>
            
            <div className="space-y-6">
              {/* Genres */}
              <div>
                <h3 className="text-gray-300 font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Badge
                      key={genre}
                      variant={selectedGenres.includes(genre) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedGenres.includes(genre)
                          ? "bg-netflix-red hover:bg-red-700"
                          : "hover:bg-netflix-lightgray"
                      }`}
                      onClick={() => toggleGenre(genre)}
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Release Year */}
              <div>
                <h3 className="text-gray-300 font-medium mb-2">
                  Release Year: {yearRange[0]} - {yearRange[1]}
                </h3>
                <Slider
                  value={yearRange}
                  min={1950}
                  max={new Date().getFullYear()}
                  step={1}
                  onValueChange={setYearRange}
                  className="mt-2"
                />
              </div>
              
              {/* Min Rating */}
              <div>
                <h3 className="text-gray-300 font-medium mb-2">
                  Min Rating: {minRating}/10
                </h3>
                <Slider
                  value={[minRating]}
                  min={0}
                  max={10}
                  step={0.1}
                  onValueChange={(value) => setMinRating(value[0])}
                  className="mt-2"
                />
              </div>
              
              <Button
                variant="outline"
                className="w-full border-gray-600 hover:bg-gray-700"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Search Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-white">
                {query ? `Results for "${query}"` : "All Movies"}
              </h1>
              <span className="text-gray-400">{searchResults.length} movies found</span>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {searchResults.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-netflix-darkgray rounded-lg">
                <h3 className="text-xl font-medium text-white mb-2">No movies found</h3>
                <p className="text-gray-400">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
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

export default Search;
