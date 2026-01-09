import React from "react";
import { Navigate } from "react-router-dom";

// Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

// Errors
import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
import Error500 from "../pages/AuthenticationInner/Errors/Error500";
import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

// Auth pages
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import VerifyOtp from "../pages/Authentication/VerifyOtp";

// User
import UserProfile from "../pages/Authentication/user-profile";

// Events
import EventList from "../pages/Events/EventList";
import CreateEvent from "../pages/Events/EventForm";
import ViewEvent from "../pages/Events/ViewEvent";
import EditEvent from "../pages/Events/EditEvent";

// Announcements
import AnnouncementList from "../pages/Announcement/AnnouncementList";
import CreateAnnouncement from "../pages/Announcement/AnnouncementForm";
import ViewAnnouncement from "../pages/Announcement/AnnouncementView";
import EditAnnouncement from "../pages/Announcement/EditAnnouncement";

// Members
import MemberList from "../pages/Members/MemberList";
import MemberForm from "../pages/Members/MemberForm";
import MemberView from "../pages/Members/MemberView";
import EditMember from "../pages/Members/EditMember";

/* ================= PUBLIC ROUTES ================= */

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/verify-otp", component: <VerifyOtp /> }, // 🔥 MUST BE PUBLIC
  { path: "/logout", component: <Logout /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },

  { path: "/auth-404-basic", component: <Basic404 /> },
  { path: "/auth-404-cover", component: <Cover404 /> },
  { path: "/auth-404-alt", component: <Alt404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/auth-offline", component: <Offlinepage /> },
];

/* ================= PROTECTED ROUTES ================= */

const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },

  { path: "/profile", component: <UserProfile /> },

  // EVENTS
  { path: "/events/list", component: <EventList /> },
  { path: "/events/create", component: <CreateEvent /> },
  { path: "/events/edit/:id", component: <EditEvent /> },
  { path: "/events/view/:id", component: <ViewEvent /> },

  // ANNOUNCEMENTS
  { path: "/announcements/list", component: <AnnouncementList /> },
  { path: "/announcements/create", component: <CreateAnnouncement /> },
  { path: "/announcements/edit/:id", component: <EditAnnouncement /> },
  { path: "/announcements/view/:id", component: <ViewAnnouncement /> },

  // MEMBERS
  { path: "/members/list", component: <MemberList /> },
  { path: "/members/create", component: <MemberForm /> },
  { path: "/members/edit/:id", component: <EditMember /> },
  { path: "/members/view/:id", component: <MemberView /> },

  // DEFAULT
  { path: "/", component: <Navigate to="/dashboard" replace /> },
  { path: "*", component: <Navigate to="/dashboard" replace /> },
];

export { publicRoutes, authProtectedRoutes };
