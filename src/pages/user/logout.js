import { logout } from "../../utilities/remote/auth";
const Logout = () => {
  return (
    <div className="position-absolute left-5 bottom-2 w-25">
      <div className="d-flex text-white align-items-center justify-content-between ">
        <i className="fa-solid fa-arrow-right-from-bracket"></i>
        <button
          onClick={() => {
            logout();
          }}
          type="button"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
