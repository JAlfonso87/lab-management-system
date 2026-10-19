import "./LineSubtitle.css";

function LineSubtitle({ subtitle }) {
  return (
    <div className="line-subtitle-container line-base">
      {subtitle ? (
        <>
          <hr className="line-left" />
          <h2 className="subtitle-text">{subtitle}</h2>
          <hr className="line-right" />
        </>
      ) : (
        <hr className="line-continuous" />
      )}
    </div>
  );
}

export default LineSubtitle;
