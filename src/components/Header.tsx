
import { Link } from "react-router-dom";

const Header = () => {
  const menuItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT US", path: "/about" },
    { label: "SECURED LOAN", path: "/housing" },
    { label: "UNSECURED LOAN", path: "/non-housing" },
    { label: "CAREER", path: "/career" },
    { label: "INVESTOR", path: "/investor" },
  ];

  return (
    <header className="w-full bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <img 
              src="https://hfs.in/wp-content/uploads/2022/07/logo.png"
              alt="CBHFL Logo" 
              className="h-16 object-contain" 
            />
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <span className="mr-2">Loan@hfs.in</span>
              <span className="mx-2">|</span>
              <span>1800-123-4567</span>
            </div>
          </div>
        </div>
        <nav className="py-4">
          <ul className="flex space-x-6 justify-center">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-primary font-medium text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

