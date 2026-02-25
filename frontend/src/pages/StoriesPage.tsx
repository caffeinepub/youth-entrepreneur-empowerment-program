import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Star, MapPin, Calendar, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useListSuccessStories } from '@/hooks/useQueries';
import { BusinessCategory } from '../backend';

const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: '🌾 Agriculture',
  [BusinessCategory.food]: '🍱 Food',
  [BusinessCategory.environment]: '🌿 Environment',
  [BusinessCategory.sustainability]: '♻️ Sustainability',
  [BusinessCategory.other]: '💡 Other',
};

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / BigInt(1_000_000));
  if (isNaN(ms) || ms <= 0) return '';
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function StoriesPage() {
  const { data: stories, isLoading } = useListSuccessStories();
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterVillage, setFilterVillage] = useState('all');

  const villages = useMemo(() => {
    const v = new Set(stories?.map((s) => s.village) ?? []);
    return Array.from(v).sort();
  }, [stories]);

  const filtered = useMemo(() => {
    return (stories ?? []).filter((s) => {
      const matchCat = filterCategory === 'all' || s.category === filterCategory;
      const matchVillage = filterVillage === 'all' || s.village === filterVillage;
      return matchCat && matchVillage;
    });
  }, [stories, filterCategory, filterVillage]);

  return (
    <div className="animate-fade-in">
      {/* Inspiring Header */}
      <section className="bg-gradient-to-br from-forest-800 to-forest-900 text-white py-14">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <Star className="w-4 h-4 text-saffron-300" />
            Success Stories
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-5xl mb-4 drop-shadow">
            Stories That Inspire a Nation
          </h1>
          <p className="text-cream-200 text-lg max-w-xl mx-auto leading-relaxed">
            Real stories from real entrepreneurs across India's villages — proof that change begins at the grassroots.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-card">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
            <Filter className="w-4 h-4" />
            Filter Stories
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                  <SelectItem key={val} value={val}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterVillage} onValueChange={setFilterVillage}>
              <SelectTrigger><SelectValue placeholder="All Villages" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Villages</SelectItem>
                {villages.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="pt-5 pb-4 px-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="font-bold text-xl text-foreground mb-2">No stories yet</h3>
            <p className="text-muted-foreground">Be the first to share your entrepreneurial journey!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((story) => (
              <Link
                key={story.id.toString()}
                to="/story/$id"
                params={{ id: story.id.toString() }}
              >
                <Card className="card-hover shadow-card border-border h-full cursor-pointer">
                  <CardContent className="pt-5 pb-5 px-5">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-saffron-50 text-saffron-600 border border-saffron-200 font-medium">
                        {CATEGORY_LABELS[story.category]}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-foreground leading-snug mb-2 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {story.content.slice(0, 150)}{story.content.length > 150 ? '...' : ''}
                    </p>
                    <div className="border-t border-border pt-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-saffron-400 fill-saffron-400" />
                        <span className="font-medium text-foreground">{story.authorName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {story.village}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(story.date)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
