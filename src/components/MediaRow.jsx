import { useRef } from "react";
import MediaCard from "./MediaCard";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";

/**
 * Horizontal snap strip of 16:9 backdrop cards. `ranked` switches to poster
 * cards behind large outlined rank numerals (Top 10).
 */
export default function MediaRow({
  title,
  items,
  onSelect,
  onPreview,
  ratingsMap,
  ranked,
  progressFor,
  watched,
  onMarkWatched,
  onMarkUnwatched,
}) {
  const strip = useRef(null);
  const page = (dir) =>
    strip.current?.scrollBy({
      left: dir * strip.current.clientWidth * 0.85,
      behavior: "smooth",
    });

  return (
    <section className="row">
      <div className="row-head">
        <h2 className="row-title">{title}</h2>
        <div className="row-nav">
          <button
            className="row-nav-btn"
            onClick={() => page(-1)}
            aria-label={`Scroll ${title} back`}
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            className="row-nav-btn"
            onClick={() => page(1)}
            aria-label={`Scroll ${title} forward`}
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>
      {ranked && (
        // Outline of the glyph silhouette: text-stroke would also trace the
        // variable font's overlapping inner contours.
        <svg
          width="0"
          height="0"
          style={{ position: "absolute" }}
          aria-hidden="true"
        >
          <filter id="rank-outline">
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="2"
              result="grown"
            />
            <feComposite
              in="grown"
              in2="SourceAlpha"
              operator="out"
              result="ring"
            />
            <feFlood floodColor="#ffffff" floodOpacity="0.4" />
            <feComposite in2="ring" operator="in" />
          </filter>
        </svg>
      )}
      <div
        className={`row-strip${ranked ? " row-strip--ranked" : ""}`}
        ref={strip}
      >
        {items.map((item, i) => {
          const type = item.media_type === "tv" ? "tv" : "movie";
          const rd = ratingsMap[`${type}_${item.id}`] || {};
          const key = `${type}_${item.id}`;
          const card = (
            <MediaCard
              key={key}
              item={item}
              variant={ranked ? undefined : "landscape"}
              onClick={() => onSelect(item)}
              onPreview={onPreview}
              progress={progressFor ? progressFor(item) : 0}
              watched={watched}
              onMarkWatched={onMarkWatched}
              onMarkUnwatched={onMarkUnwatched}
              ageRating={rd.cert}
              restricted={rd.restricted}
            />
          );
          return ranked ? (
            <div className="rank-item" key={key}>
              <span className="rank-num" aria-hidden="true">
                {i + 1}
              </span>
              {card}
            </div>
          ) : (
            card
          );
        })}
      </div>
    </section>
  );
}
