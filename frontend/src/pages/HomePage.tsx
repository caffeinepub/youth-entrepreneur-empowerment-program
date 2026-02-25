import { Link } from '@tanstack/react-router';
import { Sprout, Users, BookOpen, Star, MessageCircle, ArrowRight, TrendingUp, Leaf, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useListEntrepreneurs } from '@/hooks/useQueries';

const pillars = [
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Find',
    description: 'Discover passionate young entrepreneurs hidden in every village and panchayat across India.',
    color: 'text-saffron-500',
    bg: 'bg-saffron-50',
  },
  {
    icon: <BookOpen className="w-7 h-7" />,
    title: 'Equip',
    description: 'Provide training resources, guides, and tools to build skills in agriculture, food, and sustainability.',
    color: 'text-forest-500',
    bg: 'bg-forest-50',
  },
  {
    icon: <Star className="w-7 h-7" />,
    title: 'Motivate',
    description: 'Share inspiring success stories from fellow village entrepreneurs to fuel ambition and drive.',
    color: 'text-saffron-600',
    bg: 'bg-saffron-50',
  },
  {
    icon: <MessageCircle className="w-7 h-7" />,
    title: 'Connect',
    description: 'Build a powerful network of entrepreneurs across villages to collaborate and grow together.',
    color: 'text-forest-600',
    bg: 'bg-forest-50',
  },
];

const stats = [
  { icon: <Wheat className="w-5 h-5" />, label: 'Target per Village', value: '100–1000' },
  { icon: <TrendingUp className="w-5 h-5" />, label: 'Villages in India', value: '6,00,000+' },
  { icon: <Leaf className="w-5 h-5" />, label: 'Focus Areas', value: '5 Categories' },
];

export default function HomePage() {
  const { data: entrepreneurs } = useListEntrepreneurs();
  const totalCount = entrepreneurs?.length ?? 0;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[520px] flex items-center overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1440x600.png"
          alt="Young entrepreneurs in rural India"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 container mx-auto px-4 py-16 text-white">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
              <Sprout className="w-4 h-4 text-saffron-300" />
              <span>Youth Entrepreneur Empowerment Program</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5 drop-shadow-lg">
              Empowering India's
              <span className="block text-saffron-300">Village Entrepreneurs</span>
            </h1>

            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-xl">
              Discovering, equipping, motivating, and connecting young entrepreneurs across every village and panchayat in India — to change the face of the nation, feed the world, and protect the environment.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600 text-white font-bold shadow-saffron border-0 text-base px-6">
                  <Sprout className="w-5 h-5 mr-2" />
                  Register as Entrepreneur
                </Button>
              </Link>
              <Link to="/directory">
                <Button size="lg" variant="outline" className="border-white/60 text-white hover:bg-white/15 font-semibold text-base px-6 backdrop-blur-sm">
                  Explore Directory
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Bar */}
      <section className="bg-forest-800 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-saffron-300" />
              <span className="text-cream-200">Registered Entrepreneurs:</span>
              <span className="font-bold text-saffron-300 text-base">{totalCount.toLocaleString()}</span>
            </div>
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-sm">
                <span className="text-saffron-300">{stat.icon}</span>
                <span className="text-cream-200">{stat.label}:</span>
                <span className="font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Four Pillars */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-foreground mb-3">
              Our Four Pillars
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete ecosystem to nurture entrepreneurship from every corner of India
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => (
              <Card key={pillar.title} className="card-hover border-border shadow-card text-center">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className={`w-14 h-14 rounded-2xl ${pillar.bg} ${pillar.color} flex items-center justify-center mx-auto mb-4`}>
                    {pillar.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl mb-2 text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-forest-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-1 saffron-stripe rounded-full mx-auto mb-6" />
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-forest-800 mb-5">
              100 to 1000 Entrepreneurs in Every Village
            </h2>
            <p className="text-forest-700 text-lg leading-relaxed mb-8">
              Our vision is bold: cultivate a thriving entrepreneurial ecosystem in each of India's 6 lakh+ villages and panchayats. From agriculture and food security to environmental sustainability — young rural entrepreneurs will change the face of the nation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { emoji: '🌾', title: 'Feed the World', desc: 'Empower agri-entrepreneurs to innovate in food production and distribution.' },
                { emoji: '🌿', title: 'Protect the Environment', desc: 'Build green businesses that sustain and restore our natural ecosystems.' },
                { emoji: '🤝', title: 'Unite Communities', desc: 'Connect entrepreneurs across villages to share knowledge and opportunities.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl p-5 shadow-card border border-forest-100">
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h4 className="font-bold text-forest-800 mb-1">{item.title}</h4>
                  <p className="text-forest-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-saffron-500 to-saffron-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading font-black text-3xl sm:text-4xl mb-4 drop-shadow">
            Are You a Young Entrepreneur?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of young innovators from villages across India. Register today and become part of the movement.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-saffron-600 hover:bg-cream-100 font-bold text-base px-8 shadow-lg">
                <Sprout className="w-5 h-5 mr-2" />
                Register Now — It's Free
              </Button>
            </Link>
            <Link to="/stories">
              <Button size="lg" variant="outline" className="border-white/70 text-white hover:bg-white/15 font-semibold text-base px-8">
                Read Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Nav Cards */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-heading font-bold text-2xl text-center mb-8 text-foreground">Explore the Platform</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Directory', path: '/directory', emoji: '👥', desc: 'Browse entrepreneurs' },
              { label: 'Dashboard', path: '/dashboard', emoji: '📊', desc: 'Village stats' },
              { label: 'Resources', path: '/resources', emoji: '📚', desc: 'Training & guides' },
              { label: 'Stories', path: '/stories', emoji: '⭐', desc: 'Success stories' },
              { label: 'Community', path: '/community', emoji: '💬', desc: 'Connect & discuss' },
            ].map((item) => (
              <Link key={item.path} to={item.path}>
                <Card className="card-hover border-border shadow-card text-center cursor-pointer h-full">
                  <CardContent className="pt-6 pb-5 px-4">
                    <div className="text-3xl mb-2">{item.emoji}</div>
                    <div className="font-semibold text-sm text-foreground">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
