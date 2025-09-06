import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { PricingCard } from '../components/LemonSqueezyButton'
import { PLANS } from '../lib/lemonsqueezy'
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap,
  Target,
  Rocket,
  GraduationCap,
  Vault
} from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Income & Expense Tracking',
      description: 'AI-powered categorization and real-time financial insights'
    },
    {
      icon: Target,
      title: 'Goal-Based Savings',
      description: 'Set and achieve your financial goals with automated tracking'
    },
    {
      icon: Zap,
      title: 'AutoPilot Automation',
      description: 'Automate your finances and let AI optimize your money flow'
    },
    {
      icon: Rocket,
      title: 'Growth Engine',
      description: 'Business tools and analytics for entrepreneurs'
    },
    {
      icon: GraduationCap,
      title: 'Personal Academy',
      description: 'Learn financial literacy with personalized content'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'Your financial data is protected with military-grade encryption'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Navigation */}
      <nav className="bg-card/50 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gradient">FlowFund</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="btn-primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-float">
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Master Your Finances
              <br />
              <span className="neon-text">Effortlessly</span>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            FlowFund is the next-generation financial automation platform designed for modern students and entrepreneurs. 
            Take control of your financial future with AI-powered insights and automation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/register">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-6 text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-5 w-5 text-yellow-500 fill-current" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span>10,000+ Users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From basic tracking to advanced automation, FlowFund provides all the tools you need to master your finances.
            </p>
          </div>

          <div className="feature-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="feature-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our core features with increasing levels of automation and insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard planId="starter" />
            <PricingCard planId="business" featured={true} />
            <PricingCard planId="premium" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-lg p-12">
            <h2 className="text-4xl font-bold text-gradient mb-4">
              Ready to Transform Your Finances?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students and entrepreneurs who are already mastering their money with FlowFund.
            </p>
            <Link to="/register">
              <Button size="lg" className="btn-primary text-lg px-8 py-4">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-xl border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">F</span>
                </div>
                <span className="text-xl font-bold text-gradient">FlowFund</span>
              </div>
              <p className="text-muted-foreground">
                The next-generation financial automation platform for modern students and entrepreneurs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FlowFund. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

