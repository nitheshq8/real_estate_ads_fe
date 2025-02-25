const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="space-x-4">
              <a href="/" className="hover:underline">Home</a>
              <a href="/about" className="hover:underline">About</a>
              <a href="/contact" className="hover:underline">Contact</a>
              <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
            </div>
            <div>
              <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  