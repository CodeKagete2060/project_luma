import { useNavigate } from "react-router-dom";
import PageTransition from "./PageTransition";

export default function ErrorPage({ 
  title = "404 - Page Not Found",
  message = "Sorry, we couldn't find the page you're looking for.",
  code = "404",
  actionText = "Go back home",
  actionPath = "/"
}) {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="select-none text-blue-600 text-8xl font-bold mb-4 animate-pulse">
            {code}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          
          <p className="text-gray-600 mb-8">
            {message}
          </p>

          <button
            onClick={() => navigate(actionPath)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {actionText}
          </button>
        </div>

        {/* Decorative dots */}
        <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20 pointer-events-none">
          <div className="blur-[106px] h-56 bg-gradient-to-br from-blue-500 to-blue-400"></div>
          <div className="blur-[106px] h-32 bg-gradient-to-r from-gray-400 to-gray-300"></div>
        </div>
      </div>
    </PageTransition>
  );
}