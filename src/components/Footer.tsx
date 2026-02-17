
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>Archives</li>
              <li>Board Of Directors</li>
              <li>Deposit Schemes</li>
              <li>PMAY-CLSS Tracker</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Important Links</h3>
            <ul className="space-y-2">
              <li>All Branches</li>
              <li>Become a Partner</li>
              <li>Career</li>
              <li>Downloads</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            {/*<p>Corporate Office:</p>*/}
            <p>Sigma Building, Technology St,</p>
            <p>Hiranandani Gardens,</p>
            <p>Sainath Nagar, Powai,</p>
            <p>Kalina , Mumbai-400076</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <Facebook className="h-6 w-6" />
              <Twitter className="h-6 w-6" />
              <Instagram className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-dark py-4 text-center">
        <p>&copy; 2024 - Home Finance Limited - All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;
