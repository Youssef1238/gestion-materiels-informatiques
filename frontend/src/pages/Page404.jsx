export default function Page404() {
    document.title = "404"
return(
    <div class="min-h-screen flex flex-col items-center justify-center bg-blue-50">
        <h1 class="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
        <p class="text-2xl text-blue-700 font-semibold mb-4">
            Page Not Found
        </p>
        <p class="text-gray-600 text-center max-w-md mb-6">
            The page you are looking for does not exist, was removed, or is temporarily unavailable.
        </p>
        <a
            href="/"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
            Go Back to Home
        </a>
    </div>

)



}