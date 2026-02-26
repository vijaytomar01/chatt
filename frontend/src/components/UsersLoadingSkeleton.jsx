import { useThemeStore } from "../store/useThemeStore";

function UsersLoadingSkeleton() {
  const { getTheme } = useThemeStore();
  const theme = getTheme();

  const bgColor = theme.chatItemBg.split(' ')[0];
  const skeletonBase = theme.bg.replace('bg-', 'bg-opacity-30');

  return (
    <div className="space-y-2">
      {[1, 2, 3].map((item) => (
        <div key={item} className={`p-4 rounded-lg animate-pulse ${skeletonBase}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full ${theme.text} opacity-20`}></div>
            <div className="flex-1">
              <div className={`h-4 rounded w-3/4 mb-2 ${theme.text} opacity-20`}></div>
              <div className={`h-3 rounded w-1/2 ${theme.text} opacity-10`}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;
