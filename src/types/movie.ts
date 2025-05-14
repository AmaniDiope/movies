
export interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string; // Field for movie video URL
  trailerUrl?: string;
  releaseYear: number;
  genre: string[];
  rating: number;
  duration: string; // Format: "2h 30m"
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Fantasy",
  "Horror",
  "Romance",
  "Science Fiction",
  "Thriller",
];
