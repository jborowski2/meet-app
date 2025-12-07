'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CreateMeeting() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organizer_name: '',
  });

  const [timeOptions, setTimeOptions] = useState<string[]>(['']);
  const [locationOptions, setLocationOptions] = useState<string[]>(['']);

  const handleAddTime = () => {
    setTimeOptions([...timeOptions, '']);
  };

  const handleRemoveTime = (index: number) => {
    setTimeOptions(timeOptions.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimeOptions = [...timeOptions];
    newTimeOptions[index] = value;
    setTimeOptions(newTimeOptions);
  };

  const handleAddLocation = () => {
    setLocationOptions([...locationOptions, '']);
  };

  const handleRemoveLocation = (index: number) => {
    setLocationOptions(locationOptions.filter((_, i) => i !== index));
  };

  const handleLocationChange = (index: number, value: string) => {
    const newLocationOptions = [...locationOptions];
    newLocationOptions[index] = value;
    setLocationOptions(newLocationOptions);
  };

  const handleAiSuggestions = async (type: 'dates' | 'locations') => {
    setAiLoading(type);
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          context: {
            title: formData.title,
            description: formData.description,
          },
        }),
      });

      const data = await response.json();

      if (type === 'dates') {
        setTimeOptions(data.suggestions.map((date: string) => {
          const d = new Date(date);
          return d.toISOString().slice(0, 16);
        }));
      } else {
        setLocationOptions(data.suggestions);
      }

      toast.success(data.isAiGenerated ? 'Sugestie AI wygenerowane!' : 'Domyślne sugestie dodane');
    } catch (error) {
      toast.error('Nie udało się wygenerować sugestii');
    } finally {
      setAiLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.organizer_name) {
      toast.error('Wypełnij wymagane pola');
      return;
    }

    const filteredTimeOptions = timeOptions.filter(t => t.trim() !== '');
    const filteredLocationOptions = locationOptions.filter(l => l.trim() !== '');

    if (filteredTimeOptions.length === 0 && filteredLocationOptions.length === 0) {
      toast.error('Dodaj przynajmniej jeden termin lub lokalizację');
      return;
    }

    setLoading(true);
    try {
      console.log('Submitting form data:', {
        ...formData,
        time_options: filteredTimeOptions,
        location_options: filteredLocationOptions,
      });

      const timeOptionsISO = filteredTimeOptions.map(t => {
        if (!t) return '';
        const date = new Date(t);
        if (isNaN(date.getTime())) {
          console.error('Invalid date:', t);
          return '';
        }
        return date.toISOString();
      }).filter(t => t !== '');

      const response = await fetch('/api/meetings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          time_options: timeOptionsISO,
          location_options: filteredLocationOptions,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to create meeting');
      }

      const data = await response.json();
      console.log('Meeting created:', data);
      toast.success('Ankieta utworzona!');
      router.push(`/meeting/${data.uniqueLink}?organizer=true`);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Nie udało się utworzyć ankiety');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 rounded-xl mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Utwórz nową ankietę</h1>
          <p className="text-gray-600">
            Wypełnij poniższe informacje, aby stworzyć ankietę dla uczestników spotkania
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Podstawowe informacje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tytuł spotkania *</Label>
                <Input
                  id="title"
                  placeholder="np. Spotkanie zespołu Q1 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  placeholder="Dodaj szczegóły dotyczące spotkania..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="organizer">Twoje imię/nazwa *</Label>
                <Input
                  id="organizer"
                  placeholder="Jan Kowalski"
                  value={formData.organizer_name}
                  onChange={(e) => setFormData({ ...formData, organizer_name: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Propozycje terminów
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiSuggestions('dates')}
                  disabled={aiLoading === 'dates'}
                >
                  {aiLoading === 'dates' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Sugestie AI
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {timeOptions.map((time, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="datetime-local"
                    value={time}
                    onChange={(e) => handleTimeChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {timeOptions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTime(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTime}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj termin
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Propozycje lokalizacji
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAiSuggestions('locations')}
                  disabled={aiLoading === 'locations'}
                >
                  {aiLoading === 'locations' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Sugestie AI
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {locationOptions.map((location, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="np. Kawiarnia przy głównym rynku"
                    value={location}
                    onChange={(e) => handleLocationChange(index, e.target.value)}
                    className="flex-1"
                  />
                  {locationOptions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLocation(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddLocation}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Dodaj lokalizację
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              className="flex-1"
            >
              Anuluj
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Tworzenie...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Utwórz ankietę
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
