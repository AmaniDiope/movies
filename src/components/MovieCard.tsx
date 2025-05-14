
import React from "react";
import { Link } from "react-router-dom";
import { Movie } from "@/types/movie";
import { Card, CardContent } from "@/components/ui/card";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = "" }) => {
  if (!movie.id) {
    // Optionally, render nothing or a disabled card
    return null;
  }
  return (
    <Link to={`/movie/${movie.id}`} className="group">
      <Card className={`movie-card bg-netflix-darkgray border-none ${className}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-t-md">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <div className="text-white">
              <p className="text-sm font-medium">{movie.duration}</p>
              <p className="text-sm font-medium">{movie.rating}/10</p>
            </div>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="font-medium text-white truncate">{movie.title}</h3>
          <p className="text-gray-400 text-sm">{movie.releaseYear}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
