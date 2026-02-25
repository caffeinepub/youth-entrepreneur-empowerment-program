import { useState, useMemo } from 'react';
import { MessageCircle, Send, Loader2, Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useListCommunityPosts, useAddCommunityPost } from '@/hooks/useQueries';
import { BusinessCategory } from '../backend';
import { Principal } from '@dfinity/principal';

const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: '🌾 Agriculture',
  [BusinessCategory.food]: '🍱 Food',
  [BusinessCategory.environment]: '🌿 Environment',
  [BusinessCategory.sustainability]: '♻️ Sustainability',
  [BusinessCategory.other]: '💡 Other',
};

const CATEGORY_COLORS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: 'bg-saffron-50 text-saffron-700 border-saffron-200',
  [BusinessCategory.food]: 'bg-amber-50 text-amber-700 border-amber-200',
  [BusinessCategory.environment]: 'bg-forest-50 text-forest-700 border-forest-200',
  [BusinessCategory.sustainability]: 'bg-teal-50 text-teal-700 border-teal-200',
  [BusinessCategory.other]: 'bg-muted text-muted-foreground border-border',
};

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  if (isNaN(ms) || ms <= 0) return 'Just now';
  return new Date(ms).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

interface PostForm {
  authorName: string;
  village: string;
  panchayat: string;
  category: string;
  message: string;
}

const initialForm: PostForm = { authorName: '', village: '', panchayat: '', category: '', message: '' };

export default function CommunityPage() {
  const { data: posts, isLoading } = useListCommunityPosts();
  const { mutateAsync, isPending } = useAddCommunityPost();
  const [form, setForm] = useState<PostForm>(initialForm);
  const [errors, setErrors] = useState<Partial<PostForm>>({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPanchayat, setFilterPanchayat] = useState('all');

  const panchayats = useMemo(() => {
    const p = new Set(posts?.map((post) => post.panchayat) ?? []);
    return Array.from(p).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    return (posts ?? []).filter((p) => {
      const matchCat = filterCategory === 'all' || p.category === filterCategory;
      const matchPanchayat = filterPanchayat === 'all' || p.panchayat === filterPanchayat;
      return matchCat && matchPanchayat;
    });
  }, [posts, filterCategory, filterPanchayat]);

  const set = (field: keyof PostForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<PostForm> = {};
    if (!form.authorName.trim()) e.authorName = 'Name is required';
    if (!form.village.trim()) e.village = 'Village is required';
    if (!form.panchayat.trim()) e.panchayat = 'Panchayat is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const categoryMap: Record<string, BusinessCategory> = {
      agriculture: BusinessCategory.agriculture,
      food: BusinessCategory.food,
      environment: BusinessCategory.environment,
      sustainability: BusinessCategory.sustainability,
      other: BusinessCategory.other,
    };

    try {
      await mutateAsync({
        id: BigInt(0),
        author: Principal.anonymous(),
        message: form.message.trim(),
        village: form.village.trim(),
        panchayat: form.panchayat.trim(),
        category: categoryMap[form.category],
        timestamp: BigInt(Date.now()) * BigInt(1_000_000),
      });
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      console.error('Post failed:', err);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-gradient-to-br from-saffron-500 to-saffron-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4" />
            Community Connect
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl mb-3 drop-shadow">
            Connect with Fellow Entrepreneurs
          </h1>
          <p className="text-white/90 text-lg max-w-xl mx-auto">
            Share ideas, ask questions, and collaborate with entrepreneurs from villages across India.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Post Form */}
          <div className="lg:col-span-1">
            <Card className="shadow-card border-border sticky top-20">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Send className="w-4 h-4 text-saffron-500" />
                  Post a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="authorName" className="text-xs font-medium">Your Name *</Label>
                    <Input id="authorName" value={form.authorName} onChange={set('authorName')} placeholder="Full name" className="text-sm" />
                    {errors.authorName && <p className="text-destructive text-xs">{errors.authorName}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="village" className="text-xs font-medium">Village *</Label>
                    <Input id="village" value={form.village} onChange={set('village')} placeholder="Your village" className="text-sm" />
                    {errors.village && <p className="text-destructive text-xs">{errors.village}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="panchayat" className="text-xs font-medium">Panchayat *</Label>
                    <Input id="panchayat" value={form.panchayat} onChange={set('panchayat')} placeholder="Panchayat name" className="text-sm" />
                    {errors.panchayat && <p className="text-destructive text-xs">{errors.panchayat}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Category *</Label>
                    <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                      <SelectTrigger className="text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                          <SelectItem key={val} value={val}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-destructive text-xs">{errors.category}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="message" className="text-xs font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Share your idea, question, or collaboration request..."
                      rows={4}
                      className="text-sm resize-none"
                    />
                    {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                  </div>
                  <Button type="submit" disabled={isPending} className="w-full bg-primary text-primary-foreground font-semibold">
                    {isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Posting...</>
                    ) : (
                      <><Send className="w-4 h-4 mr-2" /> Post Message</>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Posts Feed */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-4 mb-5 shadow-card">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Filter className="w-4 h-4" />
                Filter Posts
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
                <Select value={filterPanchayat} onValueChange={setFilterPanchayat}>
                  <SelectTrigger><SelectValue placeholder="All Panchayats" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Panchayats</SelectItem>
                    {panchayats.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Posts */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="shadow-card">
                    <CardContent className="pt-4 pb-4 px-5 space-y-3">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-3 w-1/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="font-bold text-xl text-foreground mb-2">No posts yet</h3>
                <p className="text-muted-foreground">Be the first to start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filtered.map((post) => (
                  <Card key={post.id.toString()} className="shadow-card border-border">
                    <CardContent className="pt-4 pb-4 px-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-saffron-100 flex items-center justify-center text-saffron-600 font-bold text-sm flex-shrink-0">
                            {post.author.toString().charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-foreground">{post.village}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {post.panchayat}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${CATEGORY_COLORS[post.category]}`}>
                          {CATEGORY_LABELS[post.category]}
                        </span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed mb-3">{post.message}</p>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(post.timestamp)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-6">
                Showing {filtered.length} post{filtered.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
