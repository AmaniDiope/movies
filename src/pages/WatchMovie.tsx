
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMovies } from "@/context/MovieContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const WatchMovie = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMovieById } = useMovies();
  
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
  
  if (!movie.videoUrl) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">No Video Available</h1>
          <p className="text-gray-400 mb-8">This movie doesn't have a video available for playback.</p>
          <Button onClick={() => navigate(`/movie/${id}`)}>Back to Movie Details</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/movie/${id}`)}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft size={24} />
        </Button>
      </div>
      
      <div className="flex items-center justify-center h-screen">
        <video
          src={movie.videoUrl}
          controls
          autoPlay
          className="w-full h-full max-h-screen max-w-screen-2xl"
          poster={movie.imageUrl}
        />
      </div>
    </div>
  );
};

export default WatchMovie;
