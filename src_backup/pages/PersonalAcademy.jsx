import { useState } from 'react'
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Award,
  TrendingUp,
  DollarSign,
  PieChart,
  Target,
  Users,
  Lightbulb,
  FileText,
  Video,
  Headphones
} from 'lucide-react'

const PersonalAcademy = () => {
  const [activeTab, setActiveTab] = useState('courses')
  const [completedLessons, setCompletedLessons] = useState(new Set(['lesson-1', 'lesson-3']))

  const courses = [
    {
      id: 'financial-basics',
      title: 'Financial Fundamentals',
      description: 'Master the basics of personal finance, budgeting, and money management',
      level: 'Beginner',
      duration: '4 hours',
      lessons: 12,
      progress: 75,
      rating: 4.8,
      instructor: 'Sarah Johnson',
      category: 'Personal Finance'
    },
    {
      id: 'investment-101',
      title: 'Investment Strategies 101',
      description: 'Learn how to build wealth through smart investing and portfolio management',
      level: 'Intermediate',
      duration: '6 hours',
      lessons: 18,
      progress: 30,
      rating: 4.9,
      instructor: 'Michael Chen',
      category: 'Investing'
    },
    {
      id: 'business-finance',
      title: 'Business Finance Mastery',
      description: 'Understand business financial statements, cash flow, and growth strategies',
      level: 'Advanced',
      duration: '8 hours',
      lessons: 24,
      progress: 0,
      rating: 4.7,
      instructor: 'David Rodriguez',
      category: 'Business'
    },
    {
      id: 'crypto-basics',
      title: 'Cryptocurrency Fundamentals',
      description: 'Navigate the world of digital currencies and blockchain technology',
      level: 'Beginner',
      duration: '3 hours',
      lessons: 10,
      progress: 60,
      rating: 4.6,
      instructor: 'Alex Kim',
      category: 'Cryptocurrency'
    }
  ]

  const lessons = [
    {
      id: 'lesson-1',
      title: 'Understanding Your Money Mindset',
      duration: '15 min',
      type: 'video',
      completed: true,
      course: 'Financial Fundamentals'
    },
    {
      id: 'lesson-2',
      title: 'Creating Your First Budget',
      duration: '20 min',
      type: 'interactive',
      completed: false,
      course: 'Financial Fundamentals'
    },
    {
      id: 'lesson-3',
      title: 'Emergency Fund Essentials',
      duration: '12 min',
      type: 'video',
      completed: true,
      course: 'Financial Fundamentals'
    },
    {
      id: 'lesson-4',
      title: 'Debt Management Strategies',
      duration: '18 min',
      type: 'article',
      completed: false,
      course: 'Financial Fundamentals'
    },
    {
      id: 'lesson-5',
      title: 'Introduction to Stock Market',
      duration: '25 min',
      type: 'video',
      completed: false,
      course: 'Investment Strategies 101'
    }
  ]

  const achievements = [
    {
      id: 'first-course',
      title: 'First Course Completed',
      description: 'Completed your first course in Personal Academy',
      icon: Award,
      earned: true,
      date: '2024-01-15'
    },
    {
      id: 'budget-master',
      title: 'Budget Master',
      description: 'Completed all budgeting lessons',
      icon: Target,
      earned: true,
      date: '2024-01-20'
    },
    {
      id: 'investment-rookie',
      title: 'Investment Rookie',
      description: 'Started your first investment course',
      icon: TrendingUp,
      earned: false,
      date: null
    },
    {
      id: 'streak-warrior',
      title: 'Learning Streak',
      description: 'Maintained a 7-day learning streak',
      icon: Star,
      earned: false,
      date: null
    }
  ]

  const resources = [
    {
      id: 'budget-template',
      title: 'Monthly Budget Template',
      type: 'Excel Template',
      description: 'A comprehensive budget template to track your income and expenses',
      downloads: 1250,
      category: 'Templates'
    },
    {
      id: 'investment-calculator',
      title: 'Investment Growth Calculator',
      type: 'Calculator',
      description: 'Calculate compound interest and investment growth over time',
      downloads: 890,
      category: 'Tools'
    },
    {
      id: 'debt-tracker',
      title: 'Debt Payoff Tracker',
      type: 'Spreadsheet',
      description: 'Track your debt payoff progress with multiple strategies',
      downloads: 670,
      category: 'Templates'
    },
    {
      id: 'financial-checklist',
      title: 'Financial Health Checklist',
      type: 'PDF Guide',
      description: 'A comprehensive checklist to assess your financial health',
      downloads: 1100,
      category: 'Guides'
    }
  ]

  const toggleLessonComplete = (lessonId) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev)
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId)
      } else {
        newSet.add(lessonId)
      }
      return newSet
    })
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video
      case 'article': return FileText
      case 'interactive': return Play
      case 'audio': return Headphones
      default: return BookOpen
    }
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-400" />
          Personal Academy
        </h1>
        <p className="page-subtitle">Master financial literacy and build wealth-building skills</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
        {[
          { id: 'courses', label: 'Courses', icon: BookOpen },
          { id: 'lessons', label: 'My Lessons', icon: Play },
          { id: 'achievements', label: 'Achievements', icon: Award },
          { id: 'resources', label: 'Resources', icon: FileText }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Available Courses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">{course.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.level === 'Beginner' ? 'bg-green-400/20 text-green-400' :
                        course.level === 'Intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-red-400/20 text-red-400'
                      }`}>
                        {course.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span>{course.lessons} lessons</span>
                    <span>by {course.instructor}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm text-white">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {course.progress > 0 ? 'Continue Course' : 'Start Course'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-green-400" />
              Recent Lessons
            </h3>
            <div className="space-y-4">
              {lessons.map((lesson) => {
                const TypeIcon = getTypeIcon(lesson.type)
                const isCompleted = completedLessons.has(lesson.id)
                
                return (
                  <div key={lesson.id} className="flex items-center gap-4 p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-colors">
                    <button
                      onClick={() => toggleLessonComplete(lesson.id)}
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isCompleted 
                          ? 'bg-green-600 border-green-600 text-white' 
                          : 'border-gray-600 hover:border-green-500'
                      }`}
                    >
                      {isCompleted && <CheckCircle className="w-5 h-5" />}
                    </button>
                    
                    <TypeIcon className={`w-5 h-5 ${
                      lesson.type === 'video' ? 'text-red-400' :
                      lesson.type === 'article' ? 'text-blue-400' :
                      lesson.type === 'interactive' ? 'text-green-400' :
                      'text-purple-400'
                    }`} />
                    
                    <div className="flex-grow">
                      <h4 className={`font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-gray-400">{lesson.course}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      {lesson.duration}
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      {isCompleted ? 'Review' : 'Start'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              Your Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`p-6 border rounded-lg transition-colors ${
                  achievement.earned 
                    ? 'bg-yellow-400/10 border-yellow-400/30' 
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <achievement.icon className={`w-8 h-8 ${
                      achievement.earned ? 'text-yellow-400' : 'text-gray-600'
                    }`} />
                    <div>
                      <h4 className={`font-semibold ${
                        achievement.earned ? 'text-white' : 'text-gray-400'
                      }`}>
                        {achievement.title}
                      </h4>
                      {achievement.earned && achievement.date && (
                        <p className="text-sm text-yellow-400">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className={`text-sm ${
                    achievement.earned ? 'text-gray-300' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                  {!achievement.earned && (
                    <div className="mt-3 text-xs text-gray-500">
                      🔒 Complete the requirements to unlock this achievement
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Learning Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => (
                <div key={resource.id} className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-semibold">{resource.title}</h4>
                      <span className="text-sm text-purple-400">{resource.type}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {resource.downloads.toLocaleString()} downloads
                    </span>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonalAcademy

