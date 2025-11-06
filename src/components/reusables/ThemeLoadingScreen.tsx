export default function ThemeLoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading theme...
        </p>
      </div>
    </div>
  );
}
