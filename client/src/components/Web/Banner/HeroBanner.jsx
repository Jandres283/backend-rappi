// src/components/Web/Banner/HeroBanner.jsx
import "./HeroBanner.scss";

const HeroBanner = ({ title, subtitle, ctaText, onCtaClick }) => {
  return (
    <section className="hero-banner">
      <div className="banner-content">
        <h1>{title || "Tus platillos favoritos, directo a tu puerta"}</h1>
        <p>{subtitle || "Pide en los mejores restaurantes de tu zona de forma rápida y sencilla."}</p>
        <button className="btn-cta" onClick={onCtaClick}>
          {ctaText || "Explorar Menú"}
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;