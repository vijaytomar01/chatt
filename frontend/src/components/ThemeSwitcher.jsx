import { useThemeStore, THEMES } from "../store/useThemeStore";
import { Palette, X } from "lucide-react";
import { useState } from "react";

function ThemeSwitcher() {
  const { currentTheme, setTheme, getAvailableThemes } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const themes = getAvailableThemes();

  const current = THEMES[currentTheme] || THEMES.dark;
  return (
    <div className="relative">
      {/* Theme Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-colors ${current.iconButton} ${current.bg}`}
        title="Change theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {/* Theme Modal */}
      {isOpen && (
        <div className={`fixed inset-0 ${current.bg}/50 flex items-center justify-center z-50 p-4`}>
          <div className={`rounded-lg p-6 max-w-sm w-full shadow-2xl ${current.bg}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-bold text-lg ${current.text}`}>Choose Theme</h2>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-full transition-colors ${current.iconButton}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {themes.map((themeObj) => (
                <button
                  key={themeObj.id}
                  onClick={() => {
                    setTheme(themeObj.id);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-lg transition-all border-2 ${
                    currentTheme === themeObj.id
                      ? THEMES[themeObj.id].accent
                      : current.borderColor
                  }`}
                >
                  {/* Theme Preview */}
                  <div className="mb-2 h-12 rounded flex overflow-hidden gap-1">
                    <div className={`flex-1 ${themeObj.bg}`}></div>
                    <div className={`flex-1 ${themeObj.sidebarBg}`}></div>
                    <div className={`flex-1 ${themeObj.primary}-500`}></div>
                  </div>
                  <p className={`text-sm font-medium ${current.text}`}>{themeObj.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;
