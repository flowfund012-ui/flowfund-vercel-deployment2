import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Plus, Target, CheckCircle, Clock, Star, Trophy, Zap } from 'lucide-react'

const MissionTracker = () => {
  const [missions, setMissions] = useState([
    {
      id: 1,
      title: 'Build Emergency Fund',
      description: 'Save $10,000 for emergency expenses',
      category: 'Financial Security',
      difficulty: 'hard',
      status: 'in-progress',
      progress: 35,
      xpReward: 500,
      deadline: '2024-12-31',
      milestones: [
        { id: 1, title: 'Save first $1,000', completed: true },
        { id: 2, title: 'Reach $3,500', completed: true },
        { id: 3, title: 'Hit $5,000 milestone', completed: false },
        { id: 4, title: 'Complete $10,000 goal', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Track Expenses for 30 Days',
      description: 'Record every expense for a full month',
      category: 'Habit Building',
      difficulty: 'medium',
      status: 'completed',
      progress: 100,
      xpReward: 200,
      deadline: '2024-02-01',
      milestones: [
        { id: 1, title: 'Track for 7 days', completed: true },
        { id: 2, title: 'Track for 14 days', completed: true },
        { id: 3, title: 'Track for 21 days', completed: true },
        { id: 4, title: 'Complete 30 days', completed: true }
      ]
    },
    {
      id: 3,
      title: 'Reduce Monthly Expenses by 20%',
      description: 'Cut unnecessary spending and optimize budget',
      category: 'Optimization',
      difficulty: 'medium',
      status: 'in-progress',
      progress: 60,
      xpReward: 300,
      deadline: '2024-03-31',
      milestones: [
        { id: 1, title: 'Identify expense categories', completed: true },
        { id: 2, title: 'Cut 10% of expenses', completed: true },
        { id: 3, title: 'Reach 15% reduction', completed: true },
        { id: 4, title: 'Achieve 20% reduction', completed: false }
      ]
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    category: 'Financial Security',
    difficulty: 'medium',
    deadline: '',
    xpReward: 100
  })

  const totalXP = missions.filter(m => m.status === 'completed').reduce((sum, mission) => sum + mission.xpReward, 0)
  const completedMissions = missions.filter(m => m.status === 'completed').length
  const activeMissions = missions.filter(m => m.status === 'in-progress').length

  const handleAddMission = (e) => {
    e.preventDefault()
    const mission = {
      id: Date.now(),
      title: newMission.title,
      description: newMission.description,
      category: newMission.category,
      difficulty: newMission.difficulty,
      status: 'in-progress',
      progress: 0,
      xpReward: parseInt(newMission.xpReward),
      deadline: newMission.deadline,
      milestones: [
        { id: 1, title: 'Get started', completed: false },
        { id: 2, title: 'Reach 25% progress', completed: false },
        { id: 3, title: 'Reach 50% progress', completed: false },
        { id: 4, title: 'Complete mission', completed: false }
      ]
    }
    setMissions([...missions, mission])
    setNewMission({ title: '', description: '', category: 'Financial Security', difficulty: 'medium', deadline: '', xpReward: 100 })
    setShowAddForm(false)
  }

  const handleCompleteMission = (missionId) => {
    setMissions(missions.map(mission => 
      mission.id === missionId 
        ? { ...mission, status: 'completed', progress: 100 }
        : mission
    ))
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500 bg-green-500/20'
      case 'medium': return 'text-yellow-500 bg-yellow-500/20'
      case 'hard': return 'text-red-500 bg-red-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'in-progress': return <Clock className="h-5 w-5 text-yellow-500" />
      default: return <Target className="h-5 w-5 text-gray-500" />
    }
  }

  const categories = ['Financial Security', 'Habit Building', 'Optimization', 'Investment', 'Education', 'Goal Achievement']
  const difficulties = ['easy', 'medium', 'hard']

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Mission Tracker</h1>
        <p className="page-subtitle">
          Complete financial missions to level up your money management skills
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="metric-value">{totalXP}</div>
          <div className="metric-label">Total XP Earned</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="h-5 w-5 text-gold-500" />
          </div>
          <div className="metric-value">{completedMissions}</div>
          <div className="metric-label">Missions Completed</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Zap className="h-5 w-5 text-blue-500" />
          </div>
          <div className="metric-value">{activeMissions}</div>
          <div className="metric-label">Active Missions</div>
        </div>

        <div className="metric-card">
          <div className="flex items-center justify-between mb-2">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div className="metric-value">{missions.length}</div>
          <div className="metric-label">Total Missions</div>
        </div>
      </div>

      {/* Add Mission Button */}
      <div className="flex justify-between items-center">
        <h2 className="section-title">Your Missions</h2>
        <Button onClick={() => setShowAddForm(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Create Mission
        </Button>
      </div>

      {/* Add Mission Form */}
      {showAddForm && (
        <div className="dashboard-card">
          <h3 className="section-title mb-4">Create New Mission</h3>
          <form onSubmit={handleAddMission} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label className="form-label">Mission Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Save $5,000"
                value={newMission.title}
                onChange={(e) => setNewMission({...newMission, title: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Category</label>
              <select
                className="form-input"
                value={newMission.category}
                onChange={(e) => setNewMission({...newMission, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-field md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows="3"
                placeholder="Describe what this mission involves..."
                value={newMission.description}
                onChange={(e) => setNewMission({...newMission, description: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Difficulty</label>
              <select
                className="form-input"
                value={newMission.difficulty}
                onChange={(e) => setNewMission({...newMission, difficulty: e.target.value})}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">XP Reward</label>
              <input
                type="number"
                className="form-input"
                placeholder="100"
                value={newMission.xpReward}
                onChange={(e) => setNewMission({...newMission, xpReward: e.target.value})}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Deadline</label>
              <input
                type="date"
                className="form-input"
                value={newMission.deadline}
                onChange={(e) => setNewMission({...newMission, deadline: e.target.value})}
                required
              />
            </div>

            <div className="md:col-span-2 flex space-x-4">
              <Button type="submit" className="btn-primary">Create Mission</Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Missions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <div key={mission.id} className={`dashboard-card ${mission.status === 'completed' ? 'border-green-500/50 bg-green-500/5' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(mission.status)}
                <div>
                  <h3 className="font-semibold text-lg">{mission.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(mission.difficulty)}`}>
                      {mission.difficulty.toUpperCase()}
                    </span>
                    <span className="text-sm text-muted-foreground">{mission.category}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="h-4 w-4" />
                  <span className="font-semibold">{mission.xpReward} XP</span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-4">{mission.description}</p>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-semibold">{mission.progress}%</span>
              </div>

              <div className="progress-bar">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${
                    mission.status === 'completed' ? 'bg-green-500' : 'bg-primary'
                  }`}
                  style={{ width: `${mission.progress}%` }}
                />
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Milestones</h4>
                {mission.milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center space-x-2">
                    <CheckCircle className={`h-4 w-4 ${milestone.completed ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {milestone.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/50">
                <span className="text-sm text-muted-foreground">
                  Deadline: {new Date(mission.deadline).toLocaleDateString()}
                </span>
                {mission.status === 'in-progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleCompleteMission(mission.id)}
                    className="btn-primary"
                  >
                    Mark Complete
                  </Button>
                )}
                {mission.status === 'completed' && (
                  <span className="text-sm text-green-500 font-medium">✓ Completed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {missions.length === 0 && (
        <div className="dashboard-card text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Missions Yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first financial mission to start earning XP and building good habits
          </p>
          <Button onClick={() => setShowAddForm(true)} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Mission
          </Button>
        </div>
      )}
    </div>
  )
}

export default MissionTracker

