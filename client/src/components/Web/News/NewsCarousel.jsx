// src/components/Web/News/NewsCarousel.jsx
import NewsCard from "./NewsCard";

const NewsCarousel = ({ newsList = [] }) => {
  if (!newsList || newsList.length === 0) return null;

  return (
    <div className="news-carousel-container">
      <h3>Noticias y Promociones</h3>
      <div className="news-grid">
        {newsList.map((item, index) => (
          <NewsCard key={item.id || index} newsItem={item} />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;