import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navdata = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isEvents, setIsEvents] = useState(false);
  const [isAnnouncements, setIsAnnouncements] = useState(false);
  const [isMembers, setIsMembers] = useState(false);

  /* ===== AUTO OPEN FROM URL ===== */
  useEffect(() => {
    const path = location.pathname;

    setIsEvents(path.startsWith("/events"));
    setIsAnnouncements(path.startsWith("/announcements"));
    setIsMembers(path.startsWith("/members"));
  }, [location.pathname]);

  const menuItems = [
    { label: "Menu", isHeader: true },

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      link: "/dashboard",
      click: () => navigate("/dashboard"),
    },

    {
      id: "events",
      label: "Events",
      icon: "ri-calendar-event-line",
      link: "/#",
      stateVariables: isEvents,
      click: (e: any) => {
        e.preventDefault();
        setIsEvents(!isEvents);
        setIsAnnouncements(false);
        setIsMembers(false);
      },
      subItems: [
        {
          id: "event-create",
          label: "Create Event",
          link: "/events/create",
          click: () => navigate("/events/create"),
        },
        {
          id: "event-list",
          label: "Event List",
          link: "/events/list",
          click: () => navigate("/events/list"),
        },
      ],
    },

    {
      id: "announcements",
      label: "Announcements",
      icon: "ri-notification-3-line",
      link: "/#",
      stateVariables: isAnnouncements,
      click: (e: any) => {
        e.preventDefault();
        setIsAnnouncements(!isAnnouncements);
        setIsEvents(false);
        setIsMembers(false);
      },
      subItems: [
        {
          id: "announcement-create",
          label: "Create Announcement",
          link: "/announcements/create",
          click: () => navigate("/announcements/create"),
        },
        {
          id: "announcement-list",
          label: "Announcement List",
          link: "/announcements/list",
          click: () => navigate("/announcements/list"),
        },
      ],
    },

    {
      id: "members",
      label: "Members",
      icon: "ri-team-line",
      link: "/#",
      stateVariables: isMembers,
      click: (e: any) => {
        e.preventDefault();
        setIsMembers(!isMembers);
        setIsEvents(false);
        setIsAnnouncements(false);
      },
      subItems: [
        {
          id: "member-create",
          label: "Add Member",
          link: "/members/create",
          click: () => navigate("/members/create"),
        },
        {
          id: "member-list",
          label: "Member List",
          link: "/members/list",
          click: () => navigate("/members/list"),
        },
      ],
    },
  ];

  return <>{menuItems}</>;
};

export default Navdata;
