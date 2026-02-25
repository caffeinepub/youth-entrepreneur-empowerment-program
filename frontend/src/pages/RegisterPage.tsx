import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Sprout, CheckCircle, Loader2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRegisterEntrepreneur } from '@/hooks/useQueries';
import { BusinessCategory, Gender } from '../backend';
import { Principal } from '@dfinity/principal';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir',
  'Ladakh','Lakshadweep','Puducherry',
];

const CATEGORY_LABELS: Record<BusinessCategory, string> = {
  [BusinessCategory.agriculture]: '🌾 Agriculture',
  [BusinessCategory.food]: '🍱 Food',
  [BusinessCategory.environment]: '🌿 Environment',
  [BusinessCategory.sustainability]: '♻️ Sustainability',
  [BusinessCategory.other]: '💡 Other',
};

interface FormData {
  fullName: string;
  age: string;
  gender: string;
  village: string;
  panchayat: string;
  district: string;
  state: string;
  contactInfo: string;
  businessCategory: string;
  bio: string;
}

const initialForm: FormData = {
  fullName: '', age: '', gender: '', village: '', panchayat: '',
  district: '', state: '', contactInfo: '', businessCategory: '', bio: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState<Partial<FormData & { skills: string }>>({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useRegisterEntrepreneur();

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((s) => [...s, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => setSkills((s) => s.filter((x) => x !== skill));

  const validate = (): boolean => {
    const e: Partial<FormData & { skills: string }> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.age || isNaN(Number(form.age)) || Number(form.age) < 14 || Number(form.age) > 40)
      e.age = 'Age must be between 14 and 40';
    if (!form.gender) e.gender = 'Gender is required';
    if (!form.village.trim()) e.village = 'Village is required';
    if (!form.panchayat.trim()) e.panchayat = 'Panchayat is required';
    if (!form.district.trim()) e.district = 'District is required';
    if (!form.state) e.state = 'State is required';
    if (!form.contactInfo.trim()) e.contactInfo = 'Contact info is required';
    if (!form.businessCategory) e.businessCategory = 'Business category is required';
    if (!form.bio.trim()) e.bio = 'Bio is required';
    if (skills.length === 0) e.skills = 'Add at least one skill';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const genderMap: Record<string, Gender> = {
      male: Gender.male, female: Gender.female, other: Gender.other,
    };
    const categoryMap: Record<string, BusinessCategory> = {
      agriculture: BusinessCategory.agriculture,
      food: BusinessCategory.food,
      environment: BusinessCategory.environment,
      sustainability: BusinessCategory.sustainability,
      other: BusinessCategory.other,
    };

    try {
      await mutateAsync({
        id: Principal.anonymous(),
        fullName: form.fullName.trim(),
        age: BigInt(Number(form.age)),
        gender: genderMap[form.gender],
        village: form.village.trim(),
        panchayat: form.panchayat.trim(),
        district: form.district.trim(),
        state: form.state,
        contactInfo: form.contactInfo.trim(),
        businessCategory: categoryMap[form.businessCategory],
        skills,
        bio: form.bio.trim(),
      });
      setSuccess(true);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-lg text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-forest-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-forest-500" />
        </div>
        <h1 className="font-heading font-black text-3xl text-forest-800 mb-3">Welcome to YEEP India!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          You've successfully registered as an entrepreneur. Your journey to empower your village starts now!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate({ to: '/directory' })} className="bg-primary text-primary-foreground font-semibold">
            View Directory
          </Button>
          <Button variant="outline" onClick={() => { setSuccess(false); setForm(initialForm); setSkills([]); }}>
            Register Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl animate-fade-in">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-saffron-50 text-saffron-600 rounded-full px-4 py-1.5 text-sm font-medium mb-4 border border-saffron-200">
          <Sprout className="w-4 h-4" />
          Join the Movement
        </div>
        <h1 className="font-heading font-black text-3xl sm:text-4xl text-foreground mb-2">Register as Entrepreneur</h1>
        <p className="text-muted-foreground">Fill in your details to join India's largest village entrepreneur network</p>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-foreground">Personal & Business Information</CardTitle>
          <CardDescription>All fields are required unless noted</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Personal Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" value={form.fullName} onChange={set('fullName')} placeholder="Your full name" />
                {errors.fullName && <p className="text-destructive text-xs">{errors.fullName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="age">Age *</Label>
                <Input id="age" type="number" value={form.age} onChange={set('age')} placeholder="14–40" min={14} max={40} />
                {errors.age && <p className="text-destructive text-xs">{errors.age}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Gender *</Label>
                <Select value={form.gender} onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-destructive text-xs">{errors.gender}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contactInfo">Contact Info *</Label>
                <Input id="contactInfo" value={form.contactInfo} onChange={set('contactInfo')} placeholder="Phone or email" />
                {errors.contactInfo && <p className="text-destructive text-xs">{errors.contactInfo}</p>}
              </div>
            </div>

            {/* Location */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="village">Village *</Label>
                  <Input id="village" value={form.village} onChange={set('village')} placeholder="Your village name" />
                  {errors.village && <p className="text-destructive text-xs">{errors.village}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="panchayat">Panchayat *</Label>
                  <Input id="panchayat" value={form.panchayat} onChange={set('panchayat')} placeholder="Panchayat name" />
                  {errors.panchayat && <p className="text-destructive text-xs">{errors.panchayat}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="district">District *</Label>
                  <Input id="district" value={form.district} onChange={set('district')} placeholder="District name" />
                  {errors.district && <p className="text-destructive text-xs">{errors.district}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>State *</Label>
                  <Select value={form.state} onValueChange={(v) => setForm((f) => ({ ...f, state: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      {INDIAN_STATES.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-destructive text-xs">{errors.state}</p>}
                </div>
              </div>
            </div>

            {/* Business */}
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Business Details</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Business Category *</Label>
                  <Select value={form.businessCategory} onValueChange={(v) => setForm((f) => ({ ...f, businessCategory: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.businessCategory && <p className="text-destructive text-xs">{errors.businessCategory}</p>}
                </div>

                {/* Skills */}
                <div className="space-y-1.5">
                  <Label>Skills *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. Farming, Marketing, Coding"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {errors.skills && <p className="text-destructive text-xs">{errors.skills}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bio">Bio *</Label>
                  <Textarea
                    id="bio"
                    value={form.bio}
                    onChange={set('bio')}
                    placeholder="Tell us about yourself and your business idea..."
                    rows={4}
                  />
                  {errors.bio && <p className="text-destructive text-xs">{errors.bio}</p>}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-primary-foreground font-bold text-base py-5 shadow-saffron"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Registering...</>
              ) : (
                <><Sprout className="w-4 h-4 mr-2" /> Register as Entrepreneur</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
