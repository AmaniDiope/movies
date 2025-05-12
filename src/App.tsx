
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { MovieProvider } from "@/context/MovieContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Movies from "./pages/Movies";
import Genres from "./pages/Genres";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddMovie from "./pages/admin/AddMovie";
import EditMovie from "./pages/admin/EditMovie";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <MovieProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/genres/:genreName" element={<Genres />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/add" element={<AddMovie />} />
              <Route path="/admin/edit/:id" element={<EditMovie />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MovieProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
