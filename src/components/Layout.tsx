import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import Footer from './Footer';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
	children: React.ReactNode;
  }
  
  const Layout: React.FC<LayoutProps> = ({ children }) => {
	const navigate = useNavigate();
	const [session, setSession] = useState<Session | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
  
	useEffect(() => {
	  supabase.auth.getSession().then(({ data: { session } }) => {
		setSession(session);
	  });
  
	  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
		setSession(session);
		if (session) {
		  navigate('/user-dashboard');
		}
	  });
  
	  return () => subscription.unsubscribe();
	}, [navigate]);
  
	const handleLogin = async () => {
	  try {
		const { error } = await supabase.auth.signInWithOAuth({
		  provider: 'google',
		  options: {
			redirectTo: `${window.location.origin}/auth/callback`,
			skipBrowserRedirect: true,
		  }
		});
		
		if (error) throw error;
  
		const { data, error: authError } = await supabase.auth.getSession();
		if (authError) throw authError;
  
		if (data.session) {
		  setSession(data.session);
		  navigate('/user-dashboard');
		}
	  } catch (error) {
		console.error('Error logging in:', error);
		// Here you might want to show an error message to the user
	  }
	};
  
	const handleLogout = async () => {
	  try {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
		setSession(null);
		navigate('/');
	  } catch (error) {
		console.error('Error logging out:', error);
		// Here you might want to show an error message to the user
	  }
	};
  
	const toggleMenu = () => {
	  setIsMenuOpen(!isMenuOpen);
	};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex-shrink-0">
		  	<svg width="100" height="30" viewBox="0 0 573 97" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M84.2273 34.5H64.3182C63.9545 31.9242 63.2121 29.6364 62.0909 27.6364C60.9697 25.6061 59.5303 23.8788 57.7727 22.4545C56.0152 21.0303 53.9848 19.9394 51.6818 19.1818C49.4091 18.4242 46.9394 18.0455 44.2727 18.0455C39.4545 18.0455 35.2576 19.2424 31.6818 21.6364C28.1061 24 25.3333 27.4545 23.3636 32C21.3939 36.5151 20.4091 42 20.4091 48.4545C20.4091 55.0909 21.3939 60.6667 23.3636 65.1818C25.3636 69.697 28.1515 73.1061 31.7273 75.4091C35.303 77.7121 39.4394 78.8636 44.1364 78.8636C46.7727 78.8636 49.2121 78.5152 51.4545 77.8182C53.7273 77.1212 55.7424 76.1061 57.5 74.7727C59.2576 73.4091 60.7121 71.7576 61.8636 69.8182C63.0455 67.8788 63.8636 65.6667 64.3182 63.1818L84.2273 63.2727C83.7121 67.5455 82.4242 71.6667 80.3636 75.6364C78.3333 79.5758 75.5909 83.1061 72.1364 86.2273C68.7121 89.3182 64.6212 91.7727 59.8636 93.5909C55.1364 95.3788 49.7879 96.2727 43.8182 96.2727C35.5152 96.2727 28.0909 94.3939 21.5455 90.6364C15.0303 86.8788 9.87879 81.4394 6.09091 74.3182C2.33333 67.197 0.454545 58.5758 0.454545 48.4545C0.454545 38.303 2.36364 29.6667 6.18182 22.5455C10 15.4242 15.1818 10 21.7273 6.27273C28.2727 2.51515 35.6364 0.63636 43.8182 0.63636C49.2121 0.63636 54.2121 1.39394 58.8182 2.90909C63.4545 4.42424 67.5606 6.63636 71.1364 9.54545C74.7121 12.4242 77.6212 15.9545 79.8636 20.1364C82.1364 24.3182 83.5909 29.1061 84.2273 34.5ZM117.341 1.90909V95H97.9773V1.90909H117.341ZM152.761 96.3182C148.307 96.3182 144.337 95.5455 140.852 94C137.367 92.4242 134.61 90.1061 132.58 87.0455C130.58 83.9545 129.58 80.1061 129.58 75.5C129.58 71.6212 130.292 68.3636 131.716 65.7273C133.14 63.0909 135.08 60.9697 137.534 59.3636C139.989 57.7576 142.777 56.5455 145.898 55.7273C149.049 54.9091 152.352 54.3333 155.807 54C159.867 53.5758 163.14 53.1818 165.625 52.8182C168.11 52.4242 169.913 51.8485 171.034 51.0909C172.155 50.3333 172.716 49.2121 172.716 47.7273V47.4545C172.716 44.5758 171.807 42.3485 169.989 40.7727C168.201 39.197 165.655 38.4091 162.352 38.4091C158.867 38.4091 156.095 39.1818 154.034 40.7273C151.973 42.2424 150.61 44.1515 149.943 46.4545L132.034 45C132.943 40.7576 134.731 37.0909 137.398 34C140.064 30.8788 143.504 28.4848 147.716 26.8182C151.958 25.1212 156.867 24.2727 162.443 24.2727C166.322 24.2727 170.034 24.7273 173.58 25.6364C177.155 26.5455 180.322 27.9545 183.08 29.8636C185.867 31.7727 188.064 34.2273 189.67 37.2273C191.277 40.197 192.08 43.7576 192.08 47.9091V95H173.716V85.3182H173.17C172.049 87.5 170.549 89.4242 168.67 91.0909C166.792 92.7273 164.534 94.0152 161.898 94.9545C159.261 95.8636 156.216 96.3182 152.761 96.3182ZM158.307 82.9545C161.155 82.9545 163.67 82.3939 165.852 81.2727C168.034 80.1212 169.746 78.5758 170.989 76.6364C172.231 74.697 172.852 72.5 172.852 70.0455V62.6364C172.246 63.0303 171.413 63.3939 170.352 63.7273C169.322 64.0303 168.155 64.3182 166.852 64.5909C165.549 64.8333 164.246 65.0606 162.943 65.2727C161.64 65.4545 160.458 65.6212 159.398 65.7727C157.125 66.1061 155.14 66.6364 153.443 67.3636C151.746 68.0909 150.428 69.0758 149.489 70.3182C148.549 71.5303 148.08 73.0455 148.08 74.8636C148.08 77.5 149.034 79.5152 150.943 80.9091C152.883 82.2727 155.337 82.9545 158.307 82.9545ZM207.102 95V25.1818H225.875V37.3636H226.602C227.875 33.0303 230.011 29.7576 233.011 27.5455C236.011 25.303 239.466 24.1818 243.375 24.1818C244.345 24.1818 245.39 24.2424 246.511 24.3636C247.633 24.4848 248.617 24.6515 249.466 24.8636V42.0455C248.557 41.7727 247.299 41.5303 245.693 41.3182C244.087 41.1061 242.617 41 241.284 41C238.436 41 235.89 41.6212 233.648 42.8636C231.436 44.0758 229.678 45.7727 228.375 47.9545C227.102 50.1364 226.466 52.6515 226.466 55.5V95H207.102ZM287.773 96.3636C280.712 96.3636 274.606 94.8636 269.455 91.8636C264.333 88.8333 260.379 84.6212 257.591 79.2273C254.803 73.803 253.409 67.5152 253.409 60.3636C253.409 53.1515 254.803 46.8485 257.591 41.4545C260.379 36.0303 264.333 31.8182 269.455 28.8182C274.606 25.7879 280.712 24.2727 287.773 24.2727C294.833 24.2727 300.924 25.7879 306.045 28.8182C311.197 31.8182 315.167 36.0303 317.955 41.4545C320.742 46.8485 322.136 53.1515 322.136 60.3636C322.136 67.5152 320.742 73.803 317.955 79.2273C315.167 84.6212 311.197 88.8333 306.045 91.8636C300.924 94.8636 294.833 96.3636 287.773 96.3636ZM287.864 81.3636C291.076 81.3636 293.758 80.4545 295.909 78.6364C298.061 76.7879 299.682 74.2727 300.773 71.0909C301.894 67.9091 302.455 64.2879 302.455 60.2273C302.455 56.1667 301.894 52.5455 300.773 49.3636C299.682 46.1818 298.061 43.6667 295.909 41.8182C293.758 39.9697 291.076 39.0455 287.864 39.0455C284.621 39.0455 281.894 39.9697 279.682 41.8182C277.5 43.6667 275.848 46.1818 274.727 49.3636C273.636 52.5455 273.091 56.1667 273.091 60.2273C273.091 64.2879 273.636 67.9091 274.727 71.0909C275.848 74.2727 277.5 76.7879 279.682 78.6364C281.894 80.4545 284.621 81.3636 287.864 81.3636Z" fill="black"/>
                <path d="M335.091 95V1.90909H371.818C378.879 1.90909 384.894 3.25757 389.864 5.95454C394.833 8.62121 398.621 12.3333 401.227 17.0909C403.864 21.8182 405.182 27.2727 405.182 33.4545C405.182 39.6364 403.848 45.0909 401.182 49.8182C398.515 54.5455 394.652 58.2273 389.591 60.8636C384.561 63.5 378.47 64.8182 371.318 64.8182H347.909V49.0455H368.136C371.924 49.0455 375.045 48.3939 377.5 47.0909C379.985 45.7576 381.833 43.9242 383.045 41.5909C384.288 39.2273 384.909 36.5151 384.909 33.4545C384.909 30.3636 384.288 27.6667 383.045 25.3636C381.833 23.0303 379.985 21.2273 377.5 19.9545C375.015 18.6515 371.864 18 368.045 18H354.773V95H335.091ZM450.966 95H417.966V1.90909H451.239C460.602 1.90909 468.663 3.77273 475.42 7.5C482.178 11.197 487.375 16.5151 491.011 23.4545C494.678 30.3939 496.511 38.697 496.511 48.3636C496.511 58.0606 494.678 66.3939 491.011 73.3636C487.375 80.3333 482.148 85.6818 475.33 89.4091C468.542 93.1364 460.42 95 450.966 95ZM437.648 78.1364H450.148C455.966 78.1364 460.86 77.1061 464.83 75.0455C468.83 72.9545 471.83 69.7273 473.83 65.3636C475.86 60.9697 476.875 55.303 476.875 48.3636C476.875 41.4848 475.86 35.8636 473.83 31.5C471.83 27.1364 468.845 23.9242 464.875 21.8636C460.905 19.803 456.011 18.7727 450.193 18.7727H437.648V78.1364ZM511.091 95V1.90909H572.727V18.1364H530.773V40.3182H568.636V56.5455H530.773V95H511.091Z" fill="#F5004F"/>
            </svg>
          </Link>
          
          {/* Desktop navigation and login/logout */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
            <a href="mailto:hello@claropdf.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Contact</a>
            {session && (
              <Link to="/user-dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            )}
            {session ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile login and menu button */}
          <div className="flex items-center md:hidden">
            {session ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                Login
              </button>
            )}
            <button
              className="text-gray-600 hover:text-gray-900"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        <nav className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col space-y-2 p-4 bg-white">
            <li className="text-gray-600 hover:text-gray-900">
              <Link to="/blog" onClick={toggleMenu}>Blog</Link>
            </li>
            <li className="text-gray-600 hover:text-gray-900">
              <a href="mailto:hello@claropdf.com" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>Contact</a>
            </li>
            {session && (
              <li className="text-gray-600 hover:text-gray-900">
                <Link to="/user-dashboard" onClick={toggleMenu}>Dashboard</Link>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;