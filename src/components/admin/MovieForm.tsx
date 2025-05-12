
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMovies } from "@/context/MovieContext";
import { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { genres } from "@/types/movie";
import { Badge } from "@/components/ui/badge";

interface MovieFormProps {
  movieId?: string;
  mode: "add" | "edit";
}

const MovieForm: React.FC<MovieFormProps> = ({ movieId, mode }) => {
  const { addMovie, getMovieById, updateMovie } = useMovies();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<Omit<Movie, "id">>({
    title: "",
    description: "",
    imageUrl: "",
    releaseYear: new Date().getFullYear(),
    genre: [],
    rating: 0,
    duration: "",
    featured: false,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Movie, string>>>({});
  
  useEffect(() => {
    if (mode === "edit" && movieId) {
      const movie = getMovieById(movieId);
      if (movie) {
        setFormData({
          title: movie.title,
          description: movie.description,
          imageUrl: movie.imageUrl,
          releaseYear: movie.releaseYear,
          genre: movie.genre,
          rating: movie.rating,
          duration: movie.duration,
          featured: movie.featured || false,
        });
      }
    }
  }, [mode, movieId, getMovieById]);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numValue: number;
    
    if (name === "releaseYear") {
      numValue = parseInt(value);
      if (numValue > new Date().getFullYear()) {
        numValue = new Date().getFullYear();
      }
    } else {
      numValue = parseFloat(value);
      if (name === "rating" && numValue > 10) {
        numValue = 10;
      }
    }
    
    setFormData({ ...formData, [name]: numValue });
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, featured: checked });
  };
  
  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre],
    }));
  };
  
  const validate = () => {
    const newErrors: Partial<Record<keyof Movie, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
    }
    
    if (formData.genre.length === 0) {
      newErrors.genre = "At least one genre must be selected";
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    if (mode === "add") {
      addMovie(formData);
      navigate("/admin");
    } else if (mode === "edit" && movieId) {
      updateMovie(movieId, formData);
      navigate("/admin");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-300">Movie Title*</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter movie title"
            className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-gray-300">Image URL*</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter image URL"
            className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
          />
          {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="releaseYear" className="text-gray-300">Release Year*</Label>
          <Input
            id="releaseYear"
            name="releaseYear"
            type="number"
            value={formData.releaseYear}
            onChange={handleNumberChange}
            min={1900}
            max={new Date().getFullYear()}
            className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-gray-300">Duration* (e.g., "2h 30m")</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="1h 45m"
            className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
          />
          {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rating" className="text-gray-300">Rating (0-10)*</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={formData.rating}
            onChange={handleNumberChange}
            className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
          />
        </div>
        
        <div className="space-y-2 flex items-center">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={handleCheckboxChange}
              className="data-[state=checked]:bg-netflix-red"
            />
            <Label
              htmlFor="featured"
              className="text-gray-300 font-medium cursor-pointer"
            >
              Featured Movie
            </Label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-gray-300">Genres*</Label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant={formData.genre.includes(genre) ? "default" : "outline"}
              className={`cursor-pointer ${
                formData.genre.includes(genre)
                  ? "bg-netflix-red hover:bg-red-700"
                  : "hover:bg-netflix-lightgray"
              }`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </Badge>
          ))}
        </div>
        {errors.genre && <p className="text-red-500 text-sm">{errors.genre}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-gray-300">Description*</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter movie description"
          rows={5}
          className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin")}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button type="submit" variant="destructive">
          {mode === "add" ? "Add Movie" : "Update Movie"}
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;
