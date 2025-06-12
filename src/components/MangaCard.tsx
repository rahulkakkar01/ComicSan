import { memo } from 'react';
import { useNavigate } from 'react-router-dom';

interface MangaCardProps {
  id: string;
  title: string;
  coverUrl: string;
}

export const MangaCard = memo(function MangaCard({ id, title, coverUrl }: MangaCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/manga/${id}`)}
    >
      <img
        src={coverUrl}
        alt={title}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-2">
        <h2 className="text-sm font-semibold line-clamp-2">
          {title || "No Title"}
        </h2>
      </div>
    </div>
  );
});