import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/ui/button'
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName
      })
      
      if (error) {
        setError(error.message)
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    'AI-powered financial insights',
    'Automated expense tracking',
    'Goal-based savings plans',
    'Bank-level security',
    'Mobile & desktop access'
  ]

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Benefits */}
          <div className="hidden lg:flex flex-col justify-center space-y-8">
            <div>
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Link>
              
              <h1 className="text-4xl font-bold text-gradient mb-4">
                Join thousands of users mastering their finances
              </h1>
              <p className="text-xl text-muted-foreground">
                Start your journey to financial freedom with FlowFund's powerful automation tools.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-lg p-6">
              <p className="text-muted-foreground italic">
                "FlowFund transformed how I manage my finances. The automation features saved me hours every week!"
              </p>
              <div className="mt-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">JS</span>
                </div>
                <div>
                  <p className="font-medium">Jessica Smith</p>
                  <p className="text-sm text-muted-foreground">Entrepreneur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="flex flex-col justify-center">
            <div className="lg:hidden mb-6">
              <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to home
              </Link>
            </div>

            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">F</span>
                </div>
                <span className="text-2xl font-bold text-gradient">FlowFund</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
              <p className="mt-2 text-muted-foreground">
                Start your free trial today. No credit card required.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="form-field">
                  <label htmlFor="fullName" className="form-label">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="form-input pr-10"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div className="form-field">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="form-input pr-10"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary"
                >
                  {loading ? (
                    <div className="loading-spinner mr-2" />
                  ) : null}
                  Create account
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

