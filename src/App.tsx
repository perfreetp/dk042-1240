import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { CatalogPage } from "@/pages/CatalogPage";
import { ComparePage } from "@/pages/ComparePage";
import { RankingPage } from "@/pages/RankingPage";
import { FavoritesPage } from "@/pages/FavoritesPage";
import { SurveyPage } from "@/pages/SurveyPage";
import { AdminPage } from "@/pages/AdminPage";
import { ProductDetailModal } from "@/components/ProductDetailModal";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
      <ProductDetailModal />
    </Router>
  );
}
