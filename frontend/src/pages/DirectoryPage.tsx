import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Search, Users, MapPin, Briefcase, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useListEntrepreneurs } from '@/hooks/useQueries';
import { BusinessCategory } from '../backend';

const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: '🌾 Agriculture',
  [BusinessCategory.food]: '🍱 Food',
  [BusinessCategory.environment]: '🌿 Environment',
  [BusinessCategory.sustainability]: '♻️ Sustainability',
  [BusinessCategory.other]: '💡 Other',
};

const CATEGORY_COLORS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: 'bg-saffron-100 text-saffron-700 border-saffron-200',
  [BusinessCategory.food]: 'bg-amber-100 text-amber-700 border-amber-200',
  [BusinessCategory.environment]: 'bg-forest-100 text-forest-700 border-forest-200',
  [BusinessCategory.sustainability]: 'bg-teal-100 text-teal-700 border-teal-200',
  [BusinessCategory.other]: 'bg-muted text-muted-foreground border-border',
};

export default function DirectoryPage() {
  const { data: entrepreneurs, isLoading } = useListEntrepreneurs();
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');

  const states = useMemo(() => {
    const s = new Set(entrepreneurs?.map((e) => e.state) ?? []);
    return Array.from(s).sort();
  }, [entrepreneurs]);

  const districts = useMemo(() => {
    const d = new Set(
      entrepreneurs
        ?.filter((e) => filterState === 'all' || e.state === filterState)
        .map((e) => e.district) ?? []
    );
    return Array.from(d).sort();
  }, [entrepreneurs, filterState]);

  const filtered = useMemo(() => {
    return (entrepreneurs ?? []).filter((e) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.fullName.toLowerCase().includes(q) ||
        e.village.toLowerCase().includes(q) ||
        e.panchayat.toLowerCase().includes(q) ||
        e.district.toLowerCase().includes(q);
      const matchState = filterState === 'all' || e.state === filterState;
      const matchDistrict = filterDistrict === 'all' || e.district === filterDistrict;
      const matchCategory = filterCategory === 'all' || e.businessCategory === filterCategory;
      return matchSearch && matchState && matchDistrict && matchCategory;
    });
  }, [entrepreneurs, search, filterState, filterDistrict, filterCategory]);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-saffron-600 font-medium text-sm mb-2">
          <Users className="w-4 h-4" />
          Entrepreneur Directory
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground mb-2">
          Meet India's Village Entrepreneurs
        </h1>
        <p className="text-muted-foreground">
          {entrepreneurs?.length ?? 0} registered entrepreneurs across India's villages
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 mb-8 shadow-card">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
          <Filter className="w-4 h-4" />
          Filter & Search
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, village..."
              className="pl-9"
            />
          </div>
          <Select value={filterState} onValueChange={(v) => { setFilterState(v); setFilterDistrict('all'); }}>
            <SelectTrigger><SelectValue placeholder="All States" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterDistrict} onValueChange={setFilterDistrict}>
            <SelectTrigger><SelectValue placeholder="All Districts" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <SelectItem key={val} value={val}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="pt-5 pb-4 px-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="font-bold text-xl text-foreground mb-2">No entrepreneurs found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((e) => (
            <Link
              key={e.id.toString()}
              to="/entrepreneur/$id"
              params={{ id: e.id.toString() }}
            >
              <Card className="card-hover shadow-card border-border h-full cursor-pointer">
                <CardContent className="pt-5 pb-4 px-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-bold text-base text-foreground leading-tight">{e.fullName}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {e.village}, {e.panchayat}
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center flex-shrink-0 text-saffron-600 font-bold text-sm">
                      {e.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Briefcase className="w-3 h-3" />
                    {e.district}, {e.state}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_COLORS[e.businessCategory]}`}>
                      {CATEGORY_LABELS[e.businessCategory]}
                    </span>
                    {e.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                    ))}
                    {e.skills.length > 2 && (
                      <Badge variant="outline" className="text-xs">+{e.skills.length - 2}</Badge>
                    )}
                  </div>
                  {e.bio && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">{e.bio}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-center text-sm text-muted-foreground mt-6">
          Showing {filtered.length} of {entrepreneurs?.length ?? 0} entrepreneurs
        </p>
      )}
    </div>
  );
}
