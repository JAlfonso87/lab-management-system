import "./ButtonPane.css";

function ButtonPane({ settings }) {
  return (
    <div className="button-container button-base">
      {settings.length > 1
        ? settings.slice(1).map((setting) => (
            <button
              className="button-secondary"
              type="button"
              onClick={setting[1]}
            >
              {setting[0]}
            </button>
          ))
        : null}
      {
        <button
          className="button-primary"
          type="submit"
          onClick={settings[0][1]}
        >
          {settings[0][0]}
        </button>
      }
    </div>
  );
}
export default ButtonPane;
