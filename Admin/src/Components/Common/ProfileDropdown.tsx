import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

// fallback image
import avatarFallback from "../../assets/images/users/avatar-1.jpg";

const ProfileDropdown = () => {
  /* ================= REDUX ================= */

  const selectUser = createSelector(
    (state: any) => state.Profile,
    (profile) => profile?.user
  );

  const reduxUser = useSelector(selectUser);

  /* ================= LOCAL STATE ================= */

  const [userName, setUserName] = useState("Admin");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);

  const toggleProfileDropdown = () =>
    setIsProfileDropdown((prev) => !prev);

  /* ================= LOAD USER (REDUX + SESSION) ================= */

  useEffect(() => {
    const authUserRaw = sessionStorage.getItem("authUser");
    const authUser = authUserRaw ? JSON.parse(authUserRaw) : null;

    const resolvedUser = reduxUser || authUser?.user;

    if (!resolvedUser) {
      setUserName("Admin");
      setAvatar(null);
      return;
    }

    // 🔥 NAME (OTP SAFE)
    const name =
      resolvedUser.first_name ||
      resolvedUser.name ||
      resolvedUser.email ||
      "Admin";

    setUserName(name);

    // 🔥 AVATAR (DYNAMIC)
    setAvatar(resolvedUser.avatar || null);
  }, [reduxUser]);

  /* ================= UI ================= */

  return (
    <Dropdown
      isOpen={isProfileDropdown}
      toggle={toggleProfileDropdown}
      className="ms-sm-3 header-item topbar-user"
    >
      <DropdownToggle tag="button" type="button" className="btn">
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle header-profile-user"
            src={avatar || avatarFallback}
            key={avatar || "avatar"} // 🔥 force refresh
            alt="Avatar"
          />
          <span className="text-start ms-xl-2">
            <span className="d-none d-xl-inline-block ms-1 fw-medium">
              {userName}
            </span>
            <span className="d-none d-xl-block ms-1 fs-12 text-muted">
              Admin
            </span>
          </span>
        </span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <h6 className="dropdown-header">
          Welcome {userName}!
        </h6>

        <DropdownItem tag={Link} to="/profile">
          <i className="mdi mdi-account-circle me-1"></i> Profile
        </DropdownItem>

        <DropdownItem divider />

        <DropdownItem tag={Link} to="/logout">
          <i className="mdi mdi-logout me-1"></i> Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
