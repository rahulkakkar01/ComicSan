import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMangaDetails, getChapters } from "../lib/api";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  interface Manga {
    id: string;
    attributes: {
      title: { en: string };
      description: { en?: string };
    };
    relationships: {
      type: string;
      attributes: {
        fileName: string;
      };
    }[];
  }

  interface Chapter {
    id: string;
    attributes: {
      chapter?: string;
    };
  }

  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (!id) return;
    getMangaDetails(id).then((res) => setManga(res.data));
    getChapters(id).then((res) => setChapters(res.data));
  }, [id]);

  if (!manga) return <p className="text-white text-center mt-10">Loading...</p>;

  const cover = manga.relationships.find((r) => r.type === "cover_art");
  const coverUrl = cover
    ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}.512.jpg`
    : "";

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      {/* Home Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-[#2a2d30] text-white font-medium py-2 px-4 rounded-lg hover:bg-[#34383c] transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row bg-[#1a1c1e] rounded-2xl shadow-lg overflow-hidden border border-[#2a2d30]">
        {/* Left Cover Image */}
        <div className="md:w-1/3 bg-[#131517] flex items-center justify-center p-8">
          <img
            src={coverUrl}
            alt="cover"
            className="rounded-xl shadow-lg border border-[#2a2d30] w-full max-w-xs h-auto"
          />
        </div>

        {/* Right Manga Info */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-4">
              {manga.attributes.title.en}
            </h1>
            <p className="text-gray-300 mb-6 text-sm md:text-base leading-relaxed max-w-2xl">
              {manga.attributes.description.en?.slice(0, 600) || "No description available."}
            </p>

            {/* Genres / Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-[#2e3135] text-sm rounded-full">Action</span>
              <span className="px-3 py-1 bg-[#2e3135] text-sm rounded-full">Fantasy</span>
              <span className="px-3 py-1 bg-[#2e3135] text-sm rounded-full">Magic & Sword</span>
              <span className="px-3 py-1 bg-[#2e3135] text-sm rounded-full">Academy</span>
            </div>

            {/* Chapters */}
            <h2 className="text-xl font-semibold mt-6 mb-3">Chapters</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {chapters.map((ch) => (
                <li key={ch.id}>
                  <Link
                    to={`/read/${ch.id}`}
                    className="text-[#00c2ff] hover:underline text-sm"
                  >
                    Chapter {ch.attributes.chapter || "?"}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">
            {chapters[0] && (
              <Link
                to={`/read/${chapters[0].id}`}
                className="bg-[#ff4a6e] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-[#e43a5d] transition"
              >
                Read Chapter 1
              </Link>
            )}
            <button className="bg-[#2a2d30] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#34383c] transition">
              Bookmark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
