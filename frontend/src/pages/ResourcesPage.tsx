import { useState, useMemo } from 'react';
import { BookOpen, ExternalLink, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useListTrainingResources } from '@/hooks/useQueries';
import { ResourceCategory, ResourceType } from '../backend';

const CATEGORY_LABELS: Record<ResourceCategory, string> = {
  [ResourceCategory.agriculture]: '🌾 Agriculture',
  [ResourceCategory.food]: '🍱 Food',
  [ResourceCategory.environment]: '🌿 Environment',
  [ResourceCategory.sustainability]: '♻️ Sustainability',
  [ResourceCategory.general]: '📖 General',
};

const TYPE_LABELS: Record<ResourceType, string> = {
  [ResourceType.course]: '🎓 Course',
  [ResourceType.guide]: '📋 Guide',
  [ResourceType.tool]: '🔧 Tool',
  [ResourceType.video]: '🎬 Video',
};

const TYPE_COLORS: Record<ResourceType, string> = {
  [ResourceType.course]: 'bg-saffron-100 text-saffron-700 border-saffron-200',
  [ResourceType.guide]: 'bg-forest-100 text-forest-700 border-forest-200',
  [ResourceType.tool]: 'bg-amber-100 text-amber-700 border-amber-200',
  [ResourceType.video]: 'bg-red-100 text-red-700 border-red-200',
};

export default function ResourcesPage() {
  const { data: resources, isLoading } = useListTrainingResources();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');

  const filtered = useMemo(() => {
    return (resources ?? []).filter((r) => {
      const matchCat = activeCategory === 'all' || r.category === activeCategory;
      const matchType = activeType === 'all' || r.resourceType === activeType;
      return matchCat && matchType;
    });
  }, [resources, activeCategory, activeType]);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-saffron-600 font-medium text-sm mb-2">
          <BookOpen className="w-4 h-4" />
          Training & Resources
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground mb-2">
          Equip Yourself to Succeed
        </h1>
        <p className="text-muted-foreground">
          Courses, guides, tools, and videos to help you build a thriving business
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Filter className="w-4 h-4" />
          Filter Resources
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">By Category</p>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="flex-wrap h-auto gap-1 bg-muted/50">
              <TabsTrigger value="all">All</TabsTrigger>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <TabsTrigger key={val} value={val}>{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">By Type</p>
          <Tabs value={activeType} onValueChange={setActiveType}>
            <TabsList className="flex-wrap h-auto gap-1 bg-muted/50">
              <TabsTrigger value="all">All Types</TabsTrigger>
              {Object.entries(TYPE_LABELS).map(([val, label]) => (
                <TabsTrigger key={val} value={val}>{label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Resource Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="pt-5 pb-4 px-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="font-bold text-xl text-foreground mb-2">No resources found</h3>
          <p className="text-muted-foreground">Try changing your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((resource) => (
            <Card key={resource.id.toString()} className="card-hover shadow-card border-border flex flex-col">
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TYPE_COLORS[resource.resourceType]}`}>
                    {TYPE_LABELS[resource.resourceType]}
                  </span>
                  <Badge variant="outline" className="text-xs">{CATEGORY_LABELS[resource.category]}</Badge>
                </div>
                <CardTitle className="text-base font-bold leading-snug">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 flex-1 flex flex-col justify-between">
                <CardDescription className="text-sm leading-relaxed mb-4">{resource.description}</CardDescription>
                {resource.url && (
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="w-full bg-primary text-primary-foreground font-semibold">
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                      Open Resource
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          Showing {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
