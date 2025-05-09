export function Footer () {
      return (
        <footer className="w-full p-4 flex items-center justify-center bg-neutral-700/60 text-sm text-gray-300 border-t">
          <p className="text-center">
            © {new Date().getFullYear()} schedU. Développé par{" "}
            <a
              href="https://wa.me/22961151093"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              @Bestbeedev
            </a>
          </p>
        </footer>
      );
    }
    

