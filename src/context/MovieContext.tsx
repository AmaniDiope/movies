
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Movie } from "@/types/movie";
import { toast } from "sonner";
import { useAuth } from "./AuthContext"; // Import AuthContext for JWT


// Sample movie data
// No initialMovies: movies are fetched from the backend

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  // Fetch movies from backend on mount
  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/movies');
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        toast.error('Failed to fetch movies from backend');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const featuredMovies = movies.filter((movie) => movie.featured);

  const addMovie = async (movie: Omit<Movie, "id">) => {
    try {
      const res = await fetch('http://localhost:5000/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify(movie),
      });
      if (!res.ok) throw new Error('Failed to add movie');
      const newMovie = await res.json();
      setMovies((prev) => [...prev, newMovie]);
      toast.success('Movie added successfully');
    } catch (error) {
      toast.error('Failed to add movie');
    }
  };

  const updateMovie = async (id: string, updatedMovie: Partial<Movie>) => {
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify(updatedMovie),
      });
      if (!res.ok) throw new Error('Failed to update movie');
      const updated = await res.json();
      setMovies((prev) => prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)));
      toast.success('Movie updated successfully');
    } catch (error) {
      toast.error('Failed to update movie');
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: 'DELETE',
        headers: {
          ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to delete movie');
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
      toast.success('Movie deleted successfully');
    } catch (error) {
      toast.error('Failed to delete movie');
    }
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
