import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "@/components/auth/RoleSelector";
import heroImage from "@assets/generated_images/Parent_child_learning_together_745b6002.png";
import { GraduationCap, BarChart3, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  if (showRoleSelector) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-background p-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-bold text-foreground mb-4 font-display"
            >
              Welcome to G-LEARNEX
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-xl"
            >
              Choose your role to get started
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <RoleSelector onSelectRole={(role) => console.log("Selected role:", role)} />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-6xl md:text-7xl font-bold text-white mb-6 font-display"
          >
            Connect. Learn. Grow Together.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
          >
            An education platform connecting students, parents, and tutors with AI-powered learning assistance
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="backdrop-blur-md bg-white/20 hover:bg-white/30 border border-white/30 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg"
              onClick={() => setShowRoleSelector(true)}
              data-testid="button-get-started"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="backdrop-blur-md bg-white/10 hover:bg-white/20 border-2 border-white/50 text-white px-8 py-6 rounded-xl font-semibold text-lg shadow-lg"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4 font-display">
              Empowering Education for Everyone
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Supporting UN SDG-4: Quality Education through accessible, collaborative learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: "AI Homework Assistant",
                description: "Get step-by-step help with assignments from our intelligent AI tutor",
              },
              {
                icon: BarChart3,
                title: "Progress Tracking",
                description: "Parents can monitor their child's learning journey and achievements",
              },
              {
                icon: Users,
                title: "Live Tutoring",
                description: "Connect with qualified tutors for personalized learning sessions",
              },
              {
                icon: GraduationCap,
                title: "Study Resources",
                description: "Access a comprehensive library of educational materials and guides",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
