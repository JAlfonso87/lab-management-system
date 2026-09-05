import "../assets/styles/common.css";

function LineSubtitle({ subtitle }) {
  return (
    <div
      className="subtitle-container"
      style={{ marginTop: "20px", marginBottom: "20px" }}
    >
      <hr className="left-line" />
      <h2 className="subtitle-text">{subtitle}</h2>
      <hr className="right-line" />
    </div>
  );
}
export default LineSubtitle;
