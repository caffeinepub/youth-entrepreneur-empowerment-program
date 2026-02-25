import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, Star, MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function StoryDetailPage() {
  const { id } = useParams({ from: '/story/$id' });
  const { data: stories, isLoading } = useListSuccessStories();

  const story = stories?.find((s) => s.id.toString() === id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="font-bold text-xl mb-2">Story not found</h2>
        <p className="text-muted-foreground mb-6">This story may not exist or has been removed.</p>
        <Link to="/stories">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl animate-fade-in">
      <Link to="/stories">
        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Stories
        </Button>
      </Link>

      {/* Story Header */}
      <div className="mb-6">
        <Badge className="mb-3 bg-saffron-100 text-saffron-700 border-saffron-200 hover:bg-saffron-100">
          {CATEGORY_LABELS[story.category]}
        </Badge>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground leading-tight mb-4">
          {story.title}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-saffron-400 fill-saffron-400" />
            <span className="font-semibold text-foreground">{story.authorName}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {story.village}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {formatDate(story.date)}
          </div>
        </div>
      </div>

      {/* Story Content */}
      <Card className="shadow-card border-border">
        <CardContent className="pt-6 pb-6 px-6">
          <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
            {story.content.split('\n').map((para, i) => (
              <p key={i} className="mb-4 last:mb-0 text-base leading-relaxed">{para}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inspiration Footer */}
      <div className="mt-6 p-5 bg-forest-50 rounded-xl border border-forest-100 text-center">
        <p className="text-forest-700 font-medium text-sm italic">
          "Every great entrepreneur started with a single step in their village."
        </p>
        <Link to="/register" className="mt-3 inline-block">
          <Button size="sm" className="bg-primary text-primary-foreground font-semibold mt-2">
            Share Your Story — Register Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
