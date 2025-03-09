import "./Settings.css";

export const Settings = () => {
  return (
    <div className="container settings-page">
      <button
        className="settings log-out"
        type="button"
        onClick={() => alert("Logout")}
      >
        Log Out
      </button>
      <button
        className="settings delete-account"
        type="button"
        onClick={() => alert("Delete Account")}
      >
        Delete Account
      </button>
    </div>
  );
};
