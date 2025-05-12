
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Movie } from "@/types/movie";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Sample movie data
const initialMovies: Movie[] = [
  {
    id: "1",
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&auto=format&fit=crop",
    releaseYear: 2010,
    genre: ["Science Fiction", "Action", "Thriller"],
    rating: 8.8,
    duration: "2h 28m",
    featured: true,
  },
  {
    id: "2",
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop",
    releaseYear: 1999,
    genre: ["Science Fiction", "Action"],
    rating: 8.7,
    duration: "2h 16m",
    featured: true,
  },
  {
    id: "3",
    title: "Interstellar",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop",
    releaseYear: 2014,
    genre: ["Science Fiction", "Drama", "Adventure"],
    rating: 8.6,
    duration: "2h 49m",
    featured: false,
  },
];

interface MovieContextType {
  movies: Movie[];
  featuredMovies: Movie[];
  addMovie: (movie: Omit<Movie, "id">) => void;
  updateMovie: (id: string, movie: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  getMovieById: (id: string) => Movie | undefined;
  searchMovies: (query: string) => Movie[];
  filterMoviesByGenre: (genre: string) => Movie[];
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
};

interface MovieProviderProps {
  children: ReactNode;
}

export const MovieProvider = ({ children }: MovieProviderProps) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    const savedMovies = localStorage.getItem("movies");
    return savedMovies ? JSON.parse(savedMovies) : initialMovies;
  });

  // Save movies to localStorage whenever the state changes
  React.useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  const featuredMovies = movies.filter((movie) => movie.featured);

  const addMovie = (movie: Omit<Movie, "id">) => {
    const newMovie = {
      ...movie,
      id: uuidv4(),
    };
    setMovies([...movies, newMovie]);
    toast.success("Movie added successfully");
  };

  const updateMovie = (id: string, updatedMovie: Partial<Movie>) => {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, ...updatedMovie } : movie
      )
    );
    toast.success("Movie updated successfully");
  };

  const deleteMovie = (id: string) => {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
    toast.success("Movie deleted successfully");
  };

  const getMovieById = (id: string) => {
    return movies.find((movie) => movie.id === id);
  };

  const searchMovies = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(lowerCaseQuery) ||
        movie.description.toLowerCase().includes(lowerCaseQuery) ||
        movie.genre.some((g) => g.toLowerCase().includes(lowerCaseQuery))
    );
  };

  const filterMoviesByGenre = (genre: string) => {
    return movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        featuredMovies,
        addMovie,
        updateMovie,
        deleteMovie,
        getMovieById,
        searchMovies,
        filterMoviesByGenre,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
