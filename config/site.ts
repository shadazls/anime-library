export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Kurosaw",
  description: "Kurosaw is a web application that allows you to search for animes and get information about them.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Anime",
      href: "/animeCatalog",
    },
    {
      label: "Manga",
      href: "/mangaCatalog",
    },
    {
      label: "Collections",
      href: "/collections",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/shadazls",
  },
};
