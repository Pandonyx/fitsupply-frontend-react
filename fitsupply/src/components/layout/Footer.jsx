import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Email } from "@mui/icons-material";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 text-gray-300 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              FitSupply
            </h3>
            <p className='text-sm'>
              Your trusted source for premium fitness supplements and nutrition.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='hover:text-blue-400 transition-colors'>
                <Facebook />
              </a>
              <a
                href='#'
                className='hover:text-blue-400 transition-colors'>
                <Twitter />
              </a>
              <a
                href='#'
                className='hover:text-blue-400 transition-colors'>
                <Instagram />
              </a>
              <a
                href='#'
                className='hover:text-blue-400 transition-colors'>
                <Email />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-white font-semibold mb-4'>Quick Links</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/'
                  className='hover:text-blue-400 transition-colors'>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to='/products'
                  className='hover:text-blue-400 transition-colors'>
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to='/about'
                  className='hover:text-blue-400 transition-colors'>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='hover:text-blue-400 transition-colors'>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className='text-white font-semibold mb-4'>Customer Service</h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  to='/shipping'
                  className='hover:text-blue-400 transition-colors'>
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to='/returns'
                  className='hover:text-blue-400 transition-colors'>
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  to='/faq'
                  className='hover:text-blue-400 transition-colors'>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to='/support'
                  className='hover:text-blue-400 transition-colors'>
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className='text-white font-semibold mb-4'>Newsletter</h4>
            <p className='text-sm mb-4'>
              Subscribe to get special offers and updates.
            </p>
            <div className='flex flex-col space-y-2'>
              <input
                type='email'
                placeholder='Your email'
                className='px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500 text-sm'
              />
              <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800 mt-8 pt-8 text-sm text-center'>
          <p>&copy; {currentYear} FitSupply. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
