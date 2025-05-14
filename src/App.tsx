
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
import WatchMovie from "./pages/WatchMovie";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import Movies from "./pages/Movies";
import Genres from "./pages/Genres";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddMovie from "./pages/admin/AddMovie";
import EditMovie from "./pages/admin/EditMovie";
import PrivateAdminRoute from "@/components/PrivateAdminRoute";

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
              <Route path="/watch/:id" element={<WatchMovie />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/genres/:genreName" element={<Genres />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={
                <PrivateAdminRoute>
                  <AdminDashboard />
                </PrivateAdminRoute>
              } />
              <Route path="/admin/add" element={
                <PrivateAdminRoute>
                  <AddMovie />
                </PrivateAdminRoute>
              } />
              <Route path="/admin/edit/:id" element={
                <PrivateAdminRoute>
                  <EditMovie />
                </PrivateAdminRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MovieProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
