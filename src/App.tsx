import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import RandomResult from "./pages/RandomResult";
import InProgress from "./pages/InProgress";
import SaveSuccess from "./pages/SaveSuccess";
import Recommend from "./pages/Recommend";
import RecommendResult from "./pages/RecommendResult";
import CustomDecide from "./pages/CustomDecide";
import Checklist from "./pages/Checklist";
import Memories from "./pages/Memories";
import AddMemory from "./pages/AddMemory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/random" element={<RandomResult />} />
          <Route path="/in-progress" element={<InProgress />} />
          <Route path="/save-success" element={<SaveSuccess />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/recommend-result" element={<RecommendResult />} />
          <Route path="/custom" element={<CustomDecide />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/add-memory" element={<AddMemory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
