import "../assets/styles/common.css";
function Paginator({ index, setter, count }) {
  const enabler = (type) => {
    if (type == "forward") {
      let max_page = Math.ceil(count / 10);
      return index < max_page ? false : true;
    } else if (type == "back") return index == 1 ? true : false;
  };

  const nextPage = () => setter(index + 1);
  const prevPage = () => setter(index - 1);

  return (
    <div>
      <button
        onClick={prevPage}
        disabled={enabler("back")}
        className="gray-page-button"
      >
        &lt;
      </button>
      <button
        onClick={nextPage}
        disabled={enabler("forward")}
        className="gray-page-button"
      >
        &gt;
      </button>
    </div>
  );
}
export default Paginator;
