import { useMemo } from 'react';
import { BarChart2, Users, TrendingUp, Leaf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useListEntrepreneurs } from '@/hooks/useQueries';
import { BusinessCategory } from '../backend';

const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: '🌾 Agri',
  [BusinessCategory.food]: '🍱 Food',
  [BusinessCategory.environment]: '🌿 Env',
  [BusinessCategory.sustainability]: '♻️ Sustain',
  [BusinessCategory.other]: '💡 Other',
};

const CATEGORY_COLORS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: 'bg-saffron-400',
  [BusinessCategory.food]: 'bg-amber-400',
  [BusinessCategory.environment]: 'bg-forest-400',
  [BusinessCategory.sustainability]: 'bg-teal-400',
  [BusinessCategory.other]: 'bg-muted-foreground',
};

const TARGET = 1000;

interface PanchayatStats {
  panchayat: string;
  state: string;
  district: string;
  total: number;
  categories: Record<BusinessCategory, number>;
  progress: number;
}

export default function DashboardPage() {
  const { data: entrepreneurs, isLoading } = useListEntrepreneurs();

  const stats = useMemo(() => {
    if (!entrepreneurs) return { panchayats: [], totalEntrepreneurs: 0, totalPanchayats: 0, totalStates: 0 };

    const map = new Map<string, PanchayatStats>();
    for (const e of entrepreneurs) {
      const key = `${e.panchayat}||${e.district}||${e.state}`;
      if (!map.has(key)) {
        map.set(key, {
          panchayat: e.panchayat,
          state: e.state,
          district: e.district,
          total: 0,
          categories: {
            [BusinessCategory.agriculture]: 0,
            [BusinessCategory.food]: 0,
            [BusinessCategory.environment]: 0,
            [BusinessCategory.sustainability]: 0,
            [BusinessCategory.other]: 0,
          },
          progress: 0,
        });
      }
      const ps = map.get(key)!;
      ps.total += 1;
      ps.categories[e.businessCategory] += 1;
      ps.progress = Math.min(100, (ps.total / TARGET) * 100);
    }

    const panchayats = Array.from(map.values()).sort((a, b) => b.total - a.total);
    const totalStates = new Set(entrepreneurs.map((e) => e.state)).size;

    return {
      panchayats,
      totalEntrepreneurs: entrepreneurs.length,
      totalPanchayats: panchayats.length,
      totalStates,
    };
  }, [entrepreneurs]);

  return (
    <div className="animate-fade-in">
      {/* Village Mosaic Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <img
          src="/assets/generated/village-mosaic.dim_800x400.png"
          alt="Village mosaic"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/80 to-forest-900/40 flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-saffron-300 text-sm font-medium mb-2">
              <BarChart2 className="w-4 h-4" />
              Live Dashboard
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white">
              Village Entrepreneur Dashboard
            </h1>
            <p className="text-cream-200 mt-1 text-sm sm:text-base">
              Tracking progress toward 1000 entrepreneurs per panchayat
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Users className="w-5 h-5" />, label: 'Total Entrepreneurs', value: stats.totalEntrepreneurs, color: 'text-saffron-600', bg: 'bg-saffron-50' },
            { icon: <BarChart2 className="w-5 h-5" />, label: 'Active Panchayats', value: stats.totalPanchayats, color: 'text-forest-600', bg: 'bg-forest-50' },
            { icon: <TrendingUp className="w-5 h-5" />, label: 'States Covered', value: stats.totalStates, color: 'text-saffron-600', bg: 'bg-saffron-50' },
            { icon: <Leaf className="w-5 h-5" />, label: 'Target per Panchayat', value: TARGET, color: 'text-forest-600', bg: 'bg-forest-50' },
          ].map((stat) => (
            <Card key={stat.label} className="shadow-card border-border">
              <CardContent className="pt-4 pb-4 px-4">
                <div className={`w-9 h-9 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
                  {stat.icon}
                </div>
                <div className="font-black text-2xl text-foreground">{stat.value.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Panchayat List */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading font-bold text-xl text-foreground">Panchayat Progress</h2>
          <span className="text-sm text-muted-foreground">Target: {TARGET} entrepreneurs each</span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="pt-4 pb-4 px-5 space-y-3">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-3 w-full rounded-full" />
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, j) => <Skeleton key={j} className="h-5 w-16 rounded-full" />)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats.panchayats.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏘️</div>
            <h3 className="font-bold text-xl text-foreground mb-2">No panchayat data yet</h3>
            <p className="text-muted-foreground">Register entrepreneurs to see village progress here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.panchayats.map((ps) => (
              <Card key={`${ps.panchayat}-${ps.district}`} className="shadow-card border-border">
                <CardContent className="pt-4 pb-4 px-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground">{ps.panchayat}</h3>
                      <p className="text-xs text-muted-foreground">{ps.district}, {ps.state}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-black text-xl text-saffron-600">{ps.total}</span>
                      <span className="text-xs text-muted-foreground block">/ {TARGET}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress toward {TARGET} target</span>
                      <span className="font-semibold text-saffron-600">{ps.progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={ps.progress} className="h-2.5" />
                  </div>

                  {/* Category Breakdown */}
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.entries(ps.categories) as [BusinessCategory, number][])
                      .filter(([, count]) => count > 0)
                      .map(([cat, count]) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium"
                        >
                          <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat]}`} />
                          {CATEGORY_LABELS[cat]}: {count}
                        </span>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
