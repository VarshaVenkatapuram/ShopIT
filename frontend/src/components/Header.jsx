import { useEffect } from "react";
import Search from "./Search";
import { useGetMeQuery } from "../redux/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLazyLogoutQuery } from "../redux/api/authApi";
import { setUser, setIsAuthenticated } from "../redux/features/userSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: userData, isLoading } = useGetMeQuery();
  const [logout] = useLazyLogoutQuery();
  const { user } = useSelector((state) => state.auth);
 

  const cart = useSelector((state) => state.cart);
const cartItems = cart?.cartItems || [];


  useEffect(() => {
    if (userData && !user) {
      dispatch(setUser(userData));
      dispatch(setIsAuthenticated(true));
    }
  }, [userData, user, dispatch]);

  const logoutHandler = async () => {
    await logout();
    dispatch(setUser(null));
    dispatch(setIsAuthenticated(false));
    navigate(0);
  };

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-3 ps-5">
        <div className="navbar-brand">
          <Link to="/">
            <img src="../images/shopit_logo.png" alt="ShopIT Logo" />
          </Link>
        </div>
      </div>

      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>

      <div className="col-12 col-md-3 mt-4 mt-md-0 d-flex align-items-center justify-content-end gap-3">
        <Link to="/cart" style={{ textDecoration: "none" }}>
          <span id="cart">Cart</span>
          <span className="ms-1" id="cart_count">
            {cartItems.length}
          </span>
        </Link>

        {isLoading ? (
          <span className="text-white">Loading...</span>
        ) : user ? (
          <div className="dropdown">
            <button
              className="btn dropdown-toggle text-white d-flex align-items-center"
              type="button"
              id="dropDownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <figure className="avatar avatar-nav me-2 mb-0">
                <img
                  src={user?.avatar?.url || "../images/default_avatar.jpg"}
                  alt="User Avatar"
                  className="rounded-circle"
                />
              </figure>
              <span>{user?.name || "User"}</span>
            </button>
            <div className="dropdown-menu w-100" aria-labelledby="dropDownMenuButton">
              {user?.role ==="admin" && <Link className="dropdown-item" to="/admin/dashboard">Dashboard</Link> }
              
              <Link className="dropdown-item" to="/me/orders">Orders</Link>
              <Link className="dropdown-item" to="/me/profile">Profile</Link>
              <Link className="dropdown-item text-danger" to="/" onClick={logoutHandler}>Logout</Link>
            </div>
          </div>
        ) : (
          <Link to="/login" className="btn" id="login_btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
