import { Link } from 'react-router-dom';
import {
  Mail,
  Building2,
  Calendar,
  Coins,
  ShoppingBag,
  Settings,
  ChevronRight,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { currentEmployee } from '../data/mockData';

const Profile = () => {
  const stats = [
    {
      label: 'Total Points',
      value: currentEmployee.points.toLocaleString(),
      icon: Coins,
      color: 'text-points',
      bg: 'bg-points/10',
    },
    {
      label: 'Points Earned',
      value: '12,500',
      icon: TrendingUp,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Points Redeemed',
      value: '5,000',
      icon: ShoppingBag,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Rewards Claimed',
      value: '8',
      icon: Award,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  const recentActivity = [
    { type: 'earned', points: 500, description: 'Q4 Performance Bonus', date: '2024-01-15' },
    { type: 'redeemed', points: -1000, description: 'Amazon Gift Card $100', date: '2024-01-10' },
    { type: 'earned', points: 250, description: 'Team Achievement Award', date: '2024-01-05' },
    { type: 'earned', points: 1000, description: 'Employee of the Month', date: '2024-01-01' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-8">
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-32 sm:h-48 rounded-2xl overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 px-4 sm:px-8 -mt-12 sm:-mt-16">
            <img
              src={currentEmployee.avatar}
              alt={currentEmployee.name}
              className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl border-4 border-background object-cover shadow-lg"
            />

            <div className="flex-1 pb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{currentEmployee.name}</h1>

              <div className="flex flex-wrap items-center gap-3 mt-2">
                <Badge variant="secondary" className="capitalize">
                  {currentEmployee.role}
                </Badge>
                <span className="text-muted-foreground">{currentEmployee.department}</span>
              </div>
            </div>

            <Button variant="outline" className="gap-2 hidden sm:flex">
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className="p-4">
                    <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>

                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Activity
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/orders">View All</Link>
                  </Button>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            activity.type === 'earned'
                              ? 'bg-points/10 text-points'
                              : 'bg-accent/10 text-accent'
                          }`}
                        >
                          {activity.type === 'earned' ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : (
                            <ShoppingBag className="h-5 w-5" />
                          )}
                        </div>

                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`font-semibold ${
                          activity.points > 0 ? 'text-points' : 'text-muted-foreground'
                        }`}
                      >
                        {activity.points > 0 ? '+' : ''}
                        {activity.points.toLocaleString()} pts
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Info */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{currentEmployee.email}</p>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{currentEmployee.department}</p>
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">
                      {new Date(currentEmployee.joinDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <span>Order History</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>

                <Link
                  to="/products"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <span>Browse Rewards</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
