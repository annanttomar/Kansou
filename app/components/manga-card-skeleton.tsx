export const MangaCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4">
        <div className="h-6 w-3/4 mb-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-full mb-2 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-5/6 mb-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="flex justify-between items-center">
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}; 