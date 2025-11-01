import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GraduationCap, Brain, BookOpen, Users, Sparkles } from 'lucide-react';
import heroImage from '@/assets/generated_images/hero.svg';

function Landing() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleGetStarted = () => {
    if (user) {
      navigate(`/${user.role}/dashboard`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Parent and child learning together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
              Welcome to LUMA
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              An AI-powered learning platform that connects parents with their children's educational journey
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-primary hover:bg-white/90"
            >
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 font-display">Why Choose LUMA?</h2>
            <p className="text-xl text-muted-foreground">
              Empowering students and parents with cutting-edge learning tools
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={Brain}
              title="AI Homework Helper"
              description="Get step-by-step guidance with our AI tutor"
            />
            <FeatureCard
              icon={Users}
              title="Parent Connection"
              description="Stay involved in your child's learning journey"
            />
            <FeatureCard
              icon={BookOpen}
              title="Rich Resources"
              description="Access a diverse library of learning materials"
            />
            <FeatureCard
              icon={Sparkles}
              title="Interactive Learning"
              description="Engage with dynamic educational content"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="group p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-all"
    >
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

export default Landing;