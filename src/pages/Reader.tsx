import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getChapterPages, getChapterInfo, getMangaChapters } from "../lib/api";

export default function Reader() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [pages, setPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);

  useEffect(() => {
    const loadChapterAndPages = async () => {
      if (!chapterId) return;
      try {
        setIsLoading(true);
        
        // First, get the manga ID from the chapter
        const chapterInfo = await getChapterInfo(chapterId);
        const mangaId = chapterInfo.data.relationships.find(
          (rel: any) => rel.type === "manga"
        ).id;

        // Then get all chapters for this manga
        const chaptersData = await getMangaChapters(mangaId);
        const sortedChapters = chaptersData.data.sort((a: any, b: any) => 
          Number(a.attributes.chapter) - Number(b.attributes.chapter)
        );
        setChapters(sortedChapters);
        const index = sortedChapters.findIndex((ch: { id: string; }) => ch.id === chapterId);
        setCurrentChapterIndex(index);

        // Finally load the current chapter pages
        const pageData = await getChapterPages(chapterId);
        const baseUrl = pageData.baseUrl;
        const hash = pageData.chapter.hash;
        const pageUrls = pageData.chapter.data.map((filename: string) => 
          `${baseUrl}/data/${hash}/${filename}`
        );
        setPages(pageUrls);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChapterAndPages();
  }, [chapterId]);

  const goToNextChapter = () => {
    if (currentChapterIndex < chapters.length - 1) {
      navigate(`/read/${chapters[currentChapterIndex + 1].id}`);
    }
  };

  const goToPrevChapter = () => {
    if (currentChapterIndex > 0) {
      navigate(`/read/${chapters[currentChapterIndex - 1].id}`);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextChapter();
      if (e.key === 'ArrowLeft') goToPrevChapter();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentChapterIndex, chapters]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-gray-800 p-4 z-50 flex justify-between items-center">
        <Link to="/" className="text-white hover:text-gray-300">
          ← Back to Home
        </Link>
        <div className="text-white">
          {isLoading ? 'Loading...' : `Chapter ${chapters[currentChapterIndex]?.attributes.chapter}`}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="fixed left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-50 pointer-events-none">
        <button
          onClick={goToPrevChapter}
          disabled={currentChapterIndex <= 0}
          className="p-4 bg-gray-800 text-white rounded-full shadow-lg 
            hover:bg-gray-700 transition pointer-events-auto opacity-90 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <button
          onClick={goToNextChapter}
          disabled={currentChapterIndex >= chapters.length - 1}
          className="p-4 bg-gray-800 text-white rounded-full shadow-lg 
            hover:bg-gray-700 transition pointer-events-auto opacity-90
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>

      {/* Pages */}
      <div className="pt-16 pb-4 flex flex-col items-center gap-1 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="text-white text-xl mt-8">Loading chapter...</div>
        ) : (
          pages.map((pageUrl, index) => (
            <img
              key={index}
              src={pageUrl}
              alt={`Page ${index + 1}`}
              className="w-full h-auto"
              loading="lazy"
            />
          ))
        )}
      </div>
    </div>
  );
}
