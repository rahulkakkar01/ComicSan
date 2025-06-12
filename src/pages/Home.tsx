import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPopularManga, searchManga } from "../lib/api";
import { Input } from "../components/ui/input";
import { Search, Menu, X } from "lucide-react";

export default function Home() {
  const [mangaList, setMangaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState("popular"); // "popular" or "latest"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Debounced search function
  const debounceSearch = useCallback(
    (() => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          if (query.trim()) {
            setIsSearching(true);
            try {
              const data = await searchManga(query.trim());
              setMangaList(data.data || []);
            } catch (err) {
              console.error("Search failed:", err);
            } finally {
              setIsSearching(false);
            }
          } else {
            // If search is empty, fetch based on active filter
            if (activeFilter === "popular") {
              fetchPopular();
            } else if (activeFilter === "latest") {
              fetchLatest();
            }
          }
        }, 300);
      };
    })(),
    [activeFilter]
  );

  const fetchPopular = async () => {
    setLoading(true);
    try {
      const data = await getPopularManga();
      setMangaList(data.data || []);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatest = async () => {
    setLoading(true);
    try {
      // Using the proxy to get latest manga (ordered by updated date)
      const response = await fetch(`https://backend-rizr.onrender.com/api/mangadex-proxy/manga?limit=24&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&order[updatedAt]=desc`);
      if (!response.ok) throw new Error('Failed to fetch latest manga');
      const data = await response.json();
      setMangaList(data.data || []);
    } catch (err) {
      console.error("Failed to fetch latest:", err);
      // Fallback to popular manga if latest fails
      try {
        const data = await getPopularManga();
        setMangaList(data.data || []);
      } catch (fallbackErr) {
        console.error("Fallback to popular also failed:", fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSearchQuery(""); // Clear search when changing filter
    setIsMobileMenuOpen(false); // Close mobile menu when filter is selected
    if (filter === "popular") {
      fetchPopular();
    } else if (filter === "latest") {
      fetchLatest();
    }
  };

  useEffect(() => {
    fetchPopular();
  }, []);

  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header Section */}
      <div className="sticky top-0 z-50 bg-dark-card/80 backdrop-blur-sm border-b border-dark-hover">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-text-primary hover:text-accent-blue transition"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-text-primary text-xl font-bold">ComicSan</h1>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <Input
                type="search"
                placeholder="Search manga..."
                className="w-full pl-9 bg-dark-hover border-dark-hover text-text-primary 
                  placeholder:text-text-muted focus:ring-accent-blue"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-dark-card border-b border-dark-hover p-4">
            <h3 className="text-text-primary font-semibold mb-4">Browse</h3>
            <nav className="space-y-2">
              <button
                onClick={() => handleFilterChange("popular")}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  activeFilter === "popular" && !searchQuery.trim()
                    ? "bg-accent-blue text-white"
                    : "text-text-muted hover:text-text-primary hover:bg-dark-hover"
                }`}
              >
                🔥 Popular
              </button>
              <button
                onClick={() => handleFilterChange("latest")}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${
                  activeFilter === "latest" && !searchQuery.trim()
                    ? "bg-accent-blue text-white"
                    : "text-text-muted hover:text-text-primary hover:bg-dark-hover"
                }`}
              >
                ⭐ Latest
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-dark-card rounded-lg p-4 sticky top-24">
              <h3 className="text-text-primary font-semibold mb-4">Browse</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => handleFilterChange("popular")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    activeFilter === "popular" && !searchQuery.trim()
                      ? "bg-accent-blue text-white"
                      : "text-text-muted hover:text-text-primary hover:bg-dark-hover"
                  }`}
                >
                  🔥 Popular
                </button>
                <button
                  onClick={() => handleFilterChange("latest")}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    activeFilter === "latest" && !searchQuery.trim()
                      ? "bg-accent-blue text-white"
                      : "text-text-muted hover:text-text-primary hover:bg-dark-hover"
                  }`}
                >
                  ⭐ Latest
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              {searchQuery.trim() ? (
                <>
                  <Search className="w-6 h-6 text-accent-blue" />
                  Search Results for "{searchQuery}"
                </>
              ) : activeFilter === "popular" ? (
                <>
                  <span className="text-accent-red">🔥</span>
                  Popular Today
                </>
              ) : (
                <>
                  <span className="text-accent-blue">⭐</span>
                  Latest Releases
                </>
              )}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {(loading || isSearching) ? (
                [...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[2/3] bg-dark-card rounded-lg"></div>
                    <div className="h-4 bg-dark-card rounded mt-2 w-3/4"></div>
                  </div>
                ))
              ) : mangaList.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-text-muted text-lg">
                    {searchQuery.trim() ? (
                      <>
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        No manga found for "{searchQuery}"
                      </>
                    ) : (
                      "No manga available"
                    )}
                  </div>
                </div>
              ) : (
                mangaList.map((manga: any) => {
                  const cover = manga.relationships?.find(
                    (r: any) => r.type === "cover_art"
                  );
                  
                  const coverUrl = cover && cover.attributes?.fileName
                    ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.512.jpg`
                    : null;

                  const title = manga.attributes?.title?.en || 
                               manga.attributes?.title?.['ja-ro'] || 
                               manga.attributes?.title?.ja || 
                               Object.values(manga.attributes?.title || {})[0] || 
                               "Unknown Title";

                  return (
                    <div
                      key={manga.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/manga/${manga.id}`)}
                    >
                      <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                        <div className="absolute top-2 left-2 z-10 flex gap-1">
                          {manga.attributes?.status === "ongoing" && (
                            <span className="new-badge">New</span>
                          )}
                          {manga.attributes?.status === "completed" && (
                            <span className="hot-badge">Hot</span>
                          )}
                        </div>
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={title}
                            className="w-full h-full object-cover transform transition 
                              duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-dark-card flex items-center justify-center">
                            <span className="text-text-muted text-sm">No Image</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-fade 
                          opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-text-primary text-sm font-medium line-clamp-2">
                        {title}
                      </h3>
                      <div className="flex gap-1 mt-1">
                        {manga.attributes?.tags?.slice(0, 2).map((tag: any, index: number) => (
                          <span key={tag.id || index} className="tag-badge">
                            {tag.attributes?.name?.en || "Tag"}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}