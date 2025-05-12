
import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMovies } from "@/context/MovieContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, PlayCircle } from "lucide-react";
import MovieCard from "@/components/MovieCard";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieById, movies, deleteMovie } = useMovies();
  const { isAdmin } = useAuth();
  
  const movie = getMovieById(id!);
  
  if (!movie) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Movie Not Found</h1>
          <Button onClick={() => navigate("/")}>Go Back Home</Button>
        </div>
      </div>
    );
  }
  
  // Similar movies (same genre)
  const similarMovies = movies
    .filter(
      (m) => 
        m.id !== movie.id && 
        m.genre.some(g => movie.genre.includes(g))
    )
    .slice(0, 5);
    
  const handleDelete = () => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this movie?")) {
      deleteMovie(movie.id);
      navigate("/");
    }
  };
  
  const handleEdit = () => {
    navigate(`/admin/edit/${movie.id}`);
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="relative h-[70vh] mb-8">
        <div className="absolute inset-0">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black to-transparent" />
        </div>
        
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleEdit}
              className="bg-gray-800/70 hover:bg-gray-700/70"
            >
              <Edit size={16} className="text-white" />
            </Button>
            <Button 
              variant="destructive" 
              size="icon"
              onClick={handleDelete}
              className="bg-red-800/70 hover:bg-red-700/70"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="col-span-1">
            <div className="rounded-md overflow-hidden shadow-lg">
              <img 
                src={movie.imageUrl} 
                alt={movie.title} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Movie Details */}
          <div className="col-span-2">
            <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-400">
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{movie.rating}/10</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((genre) => (
                <Badge 
                  key={genre} 
                  className="bg-netflix-red hover:bg-red-700 text-white"
                >
                  {genre}
                </Badge>
              ))}
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-medium text-white mb-2">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>
            
            {movie.videoUrl ? (
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-4">Trailer</h3>
                <div className="rounded-md overflow-hidden">
                  <video 
                    src={movie.videoUrl} 
                    controls 
                    className="w-full"
                    poster={movie.imageUrl}
                  />
                  <div className="mt-4">
                    <Button 
                      variant="destructive" 
                      size="lg"
                      className="px-8 py-6 text-lg font-medium flex items-center gap-2"
                      onClick={() => navigate(`/watch/${movie.id}`)}
                    >
                      <PlayCircle size={24} />
                      Watch Full Movie
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                variant="destructive" 
                className="px-8 py-6 text-lg font-medium mb-8"
                disabled
              >
                No Video Available
              </Button>
            )}
          </div>
        </div>
        
        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {similarMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}
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

export default MovieDetail;
