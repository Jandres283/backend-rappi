// src/components/Web/News/NewsCard.jsx
const NewsCard = ({ newsItem }) => {
  const { title, summary, image, date } = newsItem || {};

  return (
    <div className="news-card">
      {image && <img src={image} alt={title} className="news-image" />}
      <div className="news-content">
        <span className="news-date">{date}</span>
        <h4>{title}</h4>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default NewsCard;