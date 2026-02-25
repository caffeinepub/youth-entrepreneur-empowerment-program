import { useParams, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, Phone, Briefcase, User, Calendar, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetEntrepreneur } from '@/hooks/useQueries';
import { BusinessCategory, Gender } from '../backend';

const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: '🌾 Agriculture',
  [BusinessCategory.food]: '🍱 Food',
  [BusinessCategory.environment]: '🌿 Environment',
  [BusinessCategory.sustainability]: '♻️ Sustainability',
  [BusinessCategory.other]: '💡 Other',
};

const GENDER_LABELS: Record<Gender, string> = {
  [Gender.male]: 'Male',
  [Gender.female]: 'Female',
  [Gender.other]: 'Other',
};

export default function EntrepreneurProfilePage() {
  const { id } = useParams({ from: '/entrepreneur/$id' });
  const { data: entrepreneur, isLoading, isError } = useGetEntrepreneur(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-48 w-full rounded-xl mb-4" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !entrepreneur) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="font-bold text-xl mb-2">Entrepreneur not found</h2>
        <p className="text-muted-foreground mb-6">This profile may not exist or has been removed.</p>
        <Link to="/directory">
          <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl animate-fade-in">
      <Link to="/directory">
        <Button variant="ghost" size="sm" className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Directory
        </Button>
      </Link>

      {/* Profile Header */}
      <Card className="shadow-card border-border mb-5">
        <CardContent className="pt-6 pb-5 px-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-saffron-100 flex items-center justify-center text-saffron-600 font-black text-2xl flex-shrink-0">
              {entrepreneur.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-heading font-black text-2xl text-foreground leading-tight">{entrepreneur.fullName}</h1>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {entrepreneur.village}, {entrepreneur.panchayat}, {entrepreneur.district}, {entrepreneur.state}
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-saffron-600 bg-saffron-50 border border-saffron-200 rounded-full px-3 py-0.5">
                  <Sprout className="w-3.5 h-3.5" />
                  {CATEGORY_LABELS[entrepreneur.businessCategory]}
                </span>
              </div>
            </div>
          </div>
          {entrepreneur.bio && (
            <p className="mt-4 text-muted-foreground leading-relaxed text-sm border-t border-border pt-4">
              {entrepreneur.bio}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <Card className="shadow-card border-border">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Personal Info
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Age</span>
              <span className="font-medium">{entrepreneur.age.toString()} years</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gender</span>
              <span className="font-medium">{GENDER_LABELS[entrepreneur.gender]}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-4">
            <p className="text-sm font-medium break-all">{entrepreneur.contactInfo}</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      <Card className="shadow-card border-border mb-5">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4">
          {entrepreneur.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {entrepreneur.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills listed</p>
          )}
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-2 pt-4 px-5">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4 grid grid-cols-2 gap-3">
          {[
            { label: 'Village', value: entrepreneur.village },
            { label: 'Panchayat', value: entrepreneur.panchayat },
            { label: 'District', value: entrepreneur.district },
            { label: 'State', value: entrepreneur.state },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-xs text-muted-foreground">{item.label}</div>
              <div className="text-sm font-medium">{item.value}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
