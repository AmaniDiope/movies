
import React from "react";
import { Link } from "react-router-dom";
import { useMovies } from "@/context/MovieContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Film, Plus } from "lucide-react";

const AdminDashboard = () => {
  const { movies, deleteMovie } = useMovies();
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-netflix-black">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <Button asChild variant="destructive">
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      deleteMovie(id);
    }
  };
  
  const moviesByGenre = genres => {
    const counts = {};
    movies.forEach(movie => {
      movie.genre.forEach(g => {
        counts[g] = (counts[g] || 0) + 1;
      });
    });
    return counts;
  };
  
  const genreCounts = moviesByGenre(movies);
  
  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <Button asChild variant="destructive">
            <Link to="/admin/add">
              <Plus size={18} className="mr-2" /> Add New Movie
            </Link>
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-netflix-darkgray border-none">
            <CardContent className="flex items-center p-6">
              <div className="bg-blue-500/20 p-3 rounded-full mr-4">
                <Film size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Movies</p>
                <h3 className="text-2xl font-bold text-white">{movies.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-netflix-darkgray border-none">
            <CardContent className="flex items-center p-6">
              <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                <Film size={24} className="text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Featured Movies</p>
                <h3 className="text-2xl font-bold text-white">
                  {movies.filter(m => m.featured).length}
                </h3>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-netflix-darkgray border-none">
            <CardContent className="flex items-center p-6">
              <div className="bg-green-500/20 p-3 rounded-full mr-4">
                <Film size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Categories</p>
                <h3 className="text-2xl font-bold text-white">
                  {Object.keys(genreCounts).length}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Movies Table */}
        <Card className="bg-netflix-darkgray border-none">
          <CardContent className="p-0">
            <div className="rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-netflix-lightgray/10">
                    <TableHead className="text-gray-300">Title</TableHead>
                    <TableHead className="text-gray-300">Year</TableHead>
                    <TableHead className="text-gray-300">Genres</TableHead>
                    <TableHead className="text-gray-300">Rating</TableHead>
                    <TableHead className="text-gray-300">Featured</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie.id} className="hover:bg-netflix-lightgray/10">
                      <TableCell className="font-medium text-white">
                        <Link to={`/movie/${movie.id}`} className="hover:text-netflix-red">
                          {movie.title}
                        </Link>
                      </TableCell>
                      <TableCell className="text-gray-300">{movie.releaseYear}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {movie.genre.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="outline" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                          {movie.genre.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{movie.genre.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="text-gray-300">{movie.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {movie.featured ? (
                          <Badge className="bg-netflix-red">Featured</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-400">
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="hover:text-blue-500"
                          >
                            <Link to={`/admin/edit/${movie.id}`}>
                              <Edit size={16} />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-netflix-red"
                            onClick={() => handleDelete(movie.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
