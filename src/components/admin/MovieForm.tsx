"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMovies } from "@/context/MovieContext"
import type { Movie } from "@/types/movie"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { genres } from "@/types/movie"
import { Badge } from "@/components/ui/badge"
import { FileVideo, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface MovieFormProps {
  movieId?: string
  mode: "add" | "edit"
}

const MovieForm: React.FC<MovieFormProps> = ({ movieId, mode }) => {
  const { addMovie, getMovieById, updateMovie } = useMovies()
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Omit<Movie, "id">>({
    title: "",
    description: "",
    imageUrl: "",
    videoUrl: "",
    trailerUrl: "",
    releaseYear: new Date().getFullYear(),
    genre: [],
    rating: 0,
    duration: "",
    featured: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof Movie, string>>>({})
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string>("")
  const [trailerPreview, setTrailerPreview] = useState<string>("")
  const [trailerError, setTrailerError] = useState<string>("")

  const MAX_FILE_SIZE = 3 * 1024 * 1024 * 1024

  useEffect(() => {
    if (mode === "edit" && movieId) {
      const movie = getMovieById(movieId)
      if (movie) {
        setFormData({
          title: movie.title,
          description: movie.description,
          imageUrl: movie.imageUrl || "",
          videoUrl: movie.videoUrl || "",
          trailerUrl: movie.trailerUrl || "",
          releaseYear: movie.releaseYear,
          genre: movie.genre,
          rating: movie.rating,
          duration: movie.duration,
          featured: movie.featured || false,
        })

        if (movie.videoUrl) {
          setVideoPreview(movie.videoUrl)
        }

        if (movie.trailerUrl) {
          handleTrailerUrlChange({ target: { value: movie.trailerUrl } } as React.ChangeEvent<HTMLInputElement>)
        }
      }
    }
  }, [mode, movieId, getMovieById])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let numValue: number

    if (name === "releaseYear") {
      numValue = Number.parseInt(value)
      if (numValue > new Date().getFullYear()) {
        numValue = new Date().getFullYear()
      }
    } else {
      numValue = Number.parseFloat(value)
      if (name === "rating" && numValue > 10) {
        numValue = 10
      }
    }

    setFormData({ ...formData, [name]: numValue })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, featured: checked })
  }

  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre) ? prev.genre.filter((g) => g !== genre) : [...prev.genre, genre],
    }))
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Video file is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024 * 1024)}GB`)
        return
      }

      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file")
        return
      }

      setVideoFile(file)

      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)

      setFormData((prev) => ({ ...prev, videoUrl: videoUrl }))
      toast.success("Video added successfully")
    }
  }

  const extractYouTubeVideoId = (url: string): string | null => {
    // Handle various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)

    return match && match[2].length === 11 ? match[2] : null
  }

  const handleTrailerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData((prev) => ({ ...prev, trailerUrl: url }))
    setTrailerError("")

    if (!url) {
      setTrailerPreview("")
      return
    }

    const videoId = extractYouTubeVideoId(url)

    if (videoId) {
      // Use YouTube's nocookie domain for better privacy and fewer issues
      const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&showinfo=0`
      setTrailerPreview(embedUrl)
      toast.success("Trailer URL added successfully")
    } else if (url) {
      setTrailerError("Invalid YouTube URL. Please enter a valid YouTube video URL.")
      setTrailerPreview("")
    }
  }

  const handleTrailerError = () => {
    setTrailerError("Unable to play this trailer. The video might be private, age-restricted, or unavailable.")
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoPreview("")
    setFormData((prev) => ({ ...prev, videoUrl: "" }))
  }

  const removeTrailer = () => {
    setTrailerPreview("")
    setTrailerError("")
    setFormData((prev) => ({ ...prev, trailerUrl: "" }))
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof Movie, string>> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required"
    }

    if (formData.genre.length === 0) {
      newErrors.genre = "At least one genre must be selected"
    }

    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    if (mode === "add") {
      addMovie(formData)
      navigate("/admin")
    } else if (mode === "edit" && movieId) {
      updateMovie(movieId, formData)
      navigate("/admin")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-gray-300">
            Movie Title*
          </Label>
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
          <Label htmlFor="imageUrl" className="text-gray-300">
            Image URL*
          </Label>
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
          <Label htmlFor="releaseYear" className="text-gray-300">
            Release Year*
          </Label>
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
          <Label htmlFor="duration" className="text-gray-300">
            Duration* (e.g., "2h 30m")
          </Label>
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
          <Label htmlFor="rating" className="text-gray-300">
            Rating (0-10)*
          </Label>
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
            <Label htmlFor="featured" className="text-gray-300 font-medium cursor-pointer">
              Featured Movie
            </Label>
          </div>
        </div>
      </div>

      {/* Full Movie Video Upload Section */}
      <div className="space-y-2">
        <Label htmlFor="videoUpload" className="text-gray-300">
          Full Movie Video
        </Label>
        <div className="bg-netflix-lightgray rounded-md p-4">
          {!videoPreview ? (
            <div className="flex flex-col items-center space-y-3">
              <FileVideo size={48} className="text-gray-400" />
              <p className="text-gray-300">Upload full movie video file</p>
              <p className="text-gray-400 text-sm">Supports MP4, WebM (max 3GB)</p>
              <div className="relative">
                <Input
                  id="videoUpload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Button type="button" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Select Video File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <video src={videoPreview} controls className="w-full rounded-md max-h-64" />
              <div className="flex justify-end">
                <Button type="button" variant="destructive" size="sm" onClick={removeVideo}>
                  Remove Video
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trailer URL Section */}
      <div className="space-y-2">
        <Label htmlFor="trailerUrl" className="text-gray-300">
          Trailer URL (YouTube)
        </Label>
        <Input
          id="trailerUrl"
          name="trailerUrl"
          value={formData.trailerUrl || ""}
          onChange={handleTrailerUrlChange}
          placeholder="Enter YouTube trailer URL (e.g., https://youtube.com/watch?v=xxxx)"
          className="bg-netflix-lightgray border-none text-white focus-visible:ring-netflix-red"
        />
        {trailerError && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{trailerError}</span>
          </div>
        )}

        {trailerPreview && (
          <div className="mt-2 space-y-3 bg-netflix-lightgray rounded-md p-4">
            <iframe
              src={trailerPreview}
              className="w-full rounded-md aspect-video"
              allowFullScreen
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onError={handleTrailerError}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
            />
            <div className="flex justify-end">
              <Button type="button" variant="destructive" size="sm" onClick={removeTrailer}>
                Remove Trailer
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-300">Genres*</Label>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant={formData.genre.includes(genre) ? "default" : "outline"}
              className={`cursor-pointer ${
                formData.genre.includes(genre) ? "bg-netflix-red hover:bg-red-700" : "hover:bg-netflix-lightgray"
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
        <Label htmlFor="description" className="text-gray-300">
          Description*
        </Label>
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
  )
}

export default MovieForm
