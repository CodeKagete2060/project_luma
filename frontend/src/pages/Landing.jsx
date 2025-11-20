import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary">
      {/* Hero Section with Background Image */}
      <div 
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80)',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(18, 16, 87, 0.7)',
        }}
      >
        <div className="absolute inset-0 bg-primary/80"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">G-LEARNEX</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              AI-Powered Educational Platform Connecting Students, Parents, and Tutors
            </p>
            <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto">
              Empowering quality education through technology, collaboration, and personalized learning experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-yellow-400 text-primary font-bold rounded-lg text-lg hover:bg-yellow-300 transition-colors shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white/20 text-white font-bold rounded-lg text-lg hover:bg-white/30 transition-colors border-2 border-white"
            >
              Sign In
            </button>
          </motion.div>

          {/* Role Selection Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
            >
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-semibold mb-2">I'm a Student</h3>
              <p className="text-white/80 mb-4">Access AI-powered homework help, resources, and connect with tutors.</p>
              <Link
                to="/register?role=student"
                className="inline-block px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors"
              >
                Join as Student
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
            >
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">I'm a Tutor</h3>
              <p className="text-white/80 mb-4">Create sessions, assign tasks, and help students succeed.</p>
              <Link
                to="/register?role=tutor"
                className="inline-block px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors"
              >
                Join as Tutor
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20"
            >
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">I'm a Parent</h3>
              <p className="text-white/80 mb-4">Track your child's progress and stay involved in their education.</p>
              <Link
                to="/register?role=parent"
                className="inline-block px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-colors"
              >
                Join as Parent
              </Link>
            </motion.div>
          </motion.div>

          {/* UNSDG 4 Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-semibold mb-4">Supporting UNSDG 4: Quality Education</h2>
            <p className="text-white/90 text-left">
              Project G-LEARNEX is committed to ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all.
              By connecting students, parents, and tutors through AI-powered tools, we're making quality education accessible to everyone, 
              regardless of their background or location.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

