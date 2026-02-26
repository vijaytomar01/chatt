import { useThemeStore } from "../store/useThemeStore";
import { useEffect } from "react";

function ThemeProvider({ children }) {
  const { currentTheme } = useThemeStore();

  useEffect(() => {
    // Store theme in data attribute for CSS to use
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  return <>{children}</>;
}

export default ThemeProvider;
