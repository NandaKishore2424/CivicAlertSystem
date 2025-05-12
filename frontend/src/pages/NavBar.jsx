import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000);

    return () => clearTimeout(animationTimer);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (e, path, sectionId) => {
    e.preventDefault();

    if (location.pathname === path) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
    }

    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Home", path: "/", sectionId: "home" },
    { name: "About", path: "/about", sectionId: "about" },
    { name: "Services", path: "/services", sectionId: "services" },
    { name: "Projects", path: "/portfolio", sectionId: "portfolio" },
    { name: "Contact", path: "/contact", sectionId: "contact" },
    { name: "Pricing", path: "/pricing", sectionId: "pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-black shadow-md py-2" : "bg-black/95 py-2"}`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="hidden md:flex items-center">
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-[#ffffff] to-[#ffffff] text-transparent bg-clip-text">
                  CIVIC
                </span>
                <span className="bg-gradient-to-r from-[#ffffff] to-[#444] text-transparent bg-clip-text font-light ml-1">
                  ALERT-SYSTEM
                </span>
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider -mt-1">
                STAY INFORMED. STAY SAFE
              </span>
            </div>
            {/* <img
              src="/logo2.png"
              alt="Naya Builders Logo"
              className="h-16 w-auto ml-3"
            /> */}
          </Link>

          <div className="md:hidden flex items-center justify-between w-full">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#ffffff] hover:text-[#f74401] transition-colors"
            >
              {isMenuOpen ? (
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-8 h-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <div className="flex items-center justify-center">
              <img
                src="/logo2.png"
                alt="Naya Builders Logo"
                className="h-10 w-auto mr-2"
              />
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-[#ffffff] to-[#ffffff] text-transparent bg-clip-text">
                    CIVIC
                  </span>
                  <span className="bg-gradient-to-r from-[#ffffff] to-[#444] text-transparent bg-clip-text font-light ml-1">
                    ALERT-SYSTEM
                  </span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wider -mt-1">
                  STAY INFORMED. STAY SAFE
                </span>
              </div>
            </div>
            <Link
              to="/contact"
              className={`bg-[#000000] text-white p-2 rounded-full hover:bg-[#333333] transition-all duration-300 hover:shadow-md ${
                isAnimating ? "animate-pulse" : ""
              }`}
            >
              <Phone
                className={`w-5 h-5 ${isAnimating ? "animate-bounce" : ""}`}
                size={20}
              />
            </Link>
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavigation(e, item.path, item.sectionId)}
                className={`font-medium text-lg transition-all duration-300 relative group ${
                  isActive(item.path)
                    ? "text-[#f74401]"
                    : "text-[#ffffff] hover:text-[#f74401]"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f74401] transition-all duration-300 group-hover:w-full ${
                    isActive(item.path) ? "w-full" : ""
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <Link
              to="/contact"
              className={`flex items-center space-x-2 bg-gradient-to-r from-[#f74401] to-[#ff6b34] text-white font-semibold px-5 py-2.5 rounded shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                isAnimating ? "animate-pulse" : ""
              }`}
            >
              <Phone size={20} />
              <span className="font-semibold">Contact Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-black/50 z-40">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white text-xl"
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-center flex-col items-center mt-12 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={(e) => handleNavigation(e, item.path, item.sectionId)}
                className={`font-medium text-xl text-white hover:text-[#f74401]`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
