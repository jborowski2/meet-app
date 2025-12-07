'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Calendar, MapPin, Users, Check, X, HelpCircle, Loader2, Share2, BarChart3, Eye, Trash2, Sparkles, ArrowLeft, Mail, Link2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

type VoteType = 'yes' | 'no' | 'maybe';

interface TimeOption {
  id: string;
  datetime: string;
}

interface LocationOption {
  id: string;
  location: string;
}

interface Vote {
  id: string;
  participant_name: string;
  time_option_id: string | null;
  location_option_id: string | null;
  vote_type: VoteType;
}

interface Meeting {
  id: string;
  unique_link: string;
  title: string;
  description: string;
  organizer_name: string;
  created_at: string;
}

export default function MeetingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const link = params.link as string;
  const isOrganizer = searchParams.get('organizer') === 'true';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [timeOptions, setTimeOptions] = useState<TimeOption[]>([]);
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [participantName, setParticipantName] = useState('');
  const [currentVotes, setCurrentVotes] = useState<Record<string, VoteType>>({});
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [invitationText, setInvitationText] = useState('');

  useEffect(() => {
    fetchMeeting();
  }, [link]);

  const fetchMeeting = async () => {
    try {
      const response = await fetch(`/api/meetings/${link}`);
      if (!response.ok) {
        toast.error('Spotkanie nie zostało znalezione');
        router.push('/');
        return;
      }

      const data = await response.json();
      setMeeting(data.meeting);
      setTimeOptions(data.timeOptions);
      setLocationOptions(data.locationOptions);
      setVotes(data.votes);
    } catch (error) {
      toast.error('Błąd podczas ładowania spotkania');
    } finally {
      setLoading(false);
    }
  };

  const handleVoteChange = (optionId: string, voteType: VoteType) => {
    setCurrentVotes({
      ...currentVotes,
      [optionId]: currentVotes[optionId] === voteType ? 'no' : voteType,
    });
  };

  const handleSubmitVotes = async () => {
    if (!participantName.trim()) {
      toast.error('Podaj swoje imię');
      return;
    }

    if (Object.keys(currentVotes).length === 0) {
      toast.error('Zagłosuj przynajmniej na jedną opcję');
      return;
    }

    setSubmitting(true);
    try {
      const votesData = Object.entries(currentVotes).map(([optionId, voteType]) => {
        const isTime = timeOptions.some(t => t.id === optionId);
        return {
          time_option_id: isTime ? optionId : null,
          location_option_id: isTime ? null : optionId,
          vote_type: voteType,
        };
      });

      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meeting_id: meeting?.id,
          participant_name: participantName,
          votes: votesData,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit votes');

      toast.success('Głosy zapisane!');
      fetchMeeting();
      setCurrentVotes({});
      setParticipantName('');
    } catch (error) {
      toast.error('Nie udało się zapisać głosów');
    } finally {
      setSubmitting(false);
    }
  };

  const getVoteCount = (optionId: string, voteType: VoteType) => {
    return votes.filter(v =>
      (v.time_option_id === optionId || v.location_option_id === optionId) &&
      v.vote_type === voteType
    ).length;
  };

  const getVotersByOption = (optionId: string, voteType: VoteType) => {
    return votes
      .filter(v =>
        (v.time_option_id === optionId || v.location_option_id === optionId) &&
        v.vote_type === voteType
      )
      .map(v => v.participant_name);
  };

  const handleDelete = async () => {
    if (!confirm('Czy na pewno chcesz usunąć tę ankietę?')) return;

    try {
      const response = await fetch(`/api/meetings/${link}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      toast.success('Ankieta usunięta');
      router.push('/');
    } catch (error) {
      toast.error('Nie udało się usunąć ankiety');
    }
  };

  const getShareLink = () => {
    return `${window.location.origin}/meeting/${link}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareLink());
    toast.success('Link skopiowany!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: meeting?.title,
          text: `Zagłosuj na termin i miejsce spotkania: ${meeting?.title}`,
          url: getShareLink(),
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const generateAiRecommendation = async () => {
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'best-option',
          context: { votes, timeOptions, locationOptions },
        }),
      });

      const data = await response.json();
      setAiRecommendation(data.suggestions);
    } catch (error) {
      toast.error('Nie udało się wygenerować rekomendacji');
    }
  };

  const generateInvitation = async () => {
    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invitation',
          context: {
            title: meeting?.title,
            description: meeting?.description,
            link: getShareLink(),
          },
        }),
      });

      const data = await response.json();
      setInvitationText(data.suggestions);
      setShareDialogOpen(true);
    } catch (error) {
      toast.error('Nie udało się wygenerować zaproszenia');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!meeting) return null;

  const uniqueParticipants = Array.from(new Set(votes.map(v => v.participant_name)));

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót
          </Button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{meeting.title}</h1>
              {meeting.description && (
                <p className="text-gray-600 mb-2">{meeting.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Organizator: {meeting.organizer_name}</span>
                <span>•</span>
                <span>Utworzono: {format(new Date(meeting.created_at), 'dd.MM.yyyy', { locale: pl })}</span>
              </div>
            </div>
            {isOrganizer && (
              <Badge className="bg-emerald-500">Aktywna</Badge>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Udostępnij
            </Button>
            {isOrganizer && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateInvitation}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Wygeneruj zaproszenie
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Usuń
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="vote" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vote">
              <Check className="w-4 h-4 mr-2" />
              Głosowanie
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="w-4 h-4 mr-2" />
              Wyniki
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vote" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Twoje imię</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Jan Kowalski"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                />
              </CardContent>
            </Card>

            {timeOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Propozycje terminów
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {timeOptions.map((option) => (
                    <div key={option.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">
                          {format(new Date(option.datetime), 'EEEE, d MMMM yyyy', { locale: pl })}
                          <div className="text-sm text-gray-500">
                            {format(new Date(option.datetime), 'HH:mm')}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          Głosów: {getVoteCount(option.id, 'yes') + getVoteCount(option.id, 'maybe')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={currentVotes[option.id] === 'yes' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVoteChange(option.id, 'yes')}
                          className={currentVotes[option.id] === 'yes' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Tak
                        </Button>
                        <Button
                          type="button"
                          variant={currentVotes[option.id] === 'maybe' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVoteChange(option.id, 'maybe')}
                          className={currentVotes[option.id] === 'maybe' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        >
                          <HelpCircle className="w-4 h-4 mr-1" />
                          Może
                        </Button>
                        <Button
                          type="button"
                          variant={currentVotes[option.id] === 'no' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVoteChange(option.id, 'no')}
                          className={currentVotes[option.id] === 'no' ? 'bg-red-500 hover:bg-red-600' : ''}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Nie
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {locationOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    Propozycje lokalizacji
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {locationOptions.map((option) => (
                    <div key={option.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">{option.location}</div>
                        <div className="text-sm text-gray-500">
                          Głosów: {getVoteCount(option.id, 'yes') + getVoteCount(option.id, 'maybe')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={currentVotes[option.id] === 'yes' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVoteChange(option.id, 'yes')}
                          className={currentVotes[option.id] === 'yes' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Tak
                        </Button>
                        <Button
                          type="button"
                          variant={currentVotes[option.id] === 'maybe' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVoteChange(option.id, 'maybe')}
                          className={currentVotes[option.id] === 'maybe' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        >
                          <HelpCircle className="w-4 h-4 mr-1" />
                          Może
                        </Button>
                        <Button
                          type="button"
                          variant={currentVotes[option.id] === 'no' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleVoteChange(option.id, 'no')}
                          className={currentVotes[option.id] === 'no' ? 'bg-red-500 hover:bg-red-600' : ''}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Nie
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleSubmitVotes}
              disabled={submitting || !participantName.trim() || Object.keys(currentVotes).length === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              size="lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Zapisywanie...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Zapisz mój głos
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Łączna liczba głosujących</CardDescription>
                  <CardTitle className="text-3xl">{uniqueParticipants.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Propozycje terminów</CardDescription>
                  <CardTitle className="text-3xl">{timeOptions.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Propozycje lokalizacji</CardDescription>
                  <CardTitle className="text-3xl">{locationOptions.length}</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {votes.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      Rekomendacja AI
                    </CardTitle>
                    {!aiRecommendation && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateAiRecommendation}
                      >
                        Generuj
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {aiRecommendation && (
                  <CardContent>
                    <p className="text-gray-700">{aiRecommendation}</p>
                  </CardContent>
                )}
              </Card>
            )}

            {timeOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Wyniki dla terminów
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {timeOptions.map((option) => {
                    const yesCount = getVoteCount(option.id, 'yes');
                    const maybeCount = getVoteCount(option.id, 'maybe');
                    const noCount = getVoteCount(option.id, 'no');
                    const total = votes.filter(v => v.time_option_id === option.id).length;

                    return (
                      <div key={option.id} className="p-4 border rounded-lg bg-emerald-50">
                        <div className="font-medium mb-2">
                          {format(new Date(option.datetime), 'EEEE, d MMMM yyyy', { locale: pl })} •{' '}
                          {format(new Date(option.datetime), 'HH:mm')}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-24 flex items-center gap-1">
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium">TAK:</span>
                              </div>
                              <div className="flex-1 h-6 bg-emerald-200 rounded overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500"
                                  style={{ width: total > 0 ? `${(yesCount / total) * 100}%` : '0%' }}
                                />
                              </div>
                            </div>
                            <span className="font-bold ml-2 w-8 text-right">{yesCount}</span>
                          </div>
                          {yesCount > 0 && (
                            <div className="text-xs text-gray-600 ml-24">
                              Głosy: {getVotersByOption(option.id, 'yes').map(name => (
                                <Badge key={name} variant="secondary" className="mr-1 mb-1">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-24 flex items-center gap-1">
                                <HelpCircle className="w-4 h-4 text-orange-600" />
                                <span className="font-medium">MOŻE:</span>
                              </div>
                              <div className="flex-1 h-6 bg-orange-200 rounded overflow-hidden">
                                <div
                                  className="h-full bg-orange-500"
                                  style={{ width: total > 0 ? `${(maybeCount / total) * 100}%` : '0%' }}
                                />
                              </div>
                            </div>
                            <span className="font-bold ml-2 w-8 text-right">{maybeCount}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-24 flex items-center gap-1">
                                <X className="w-4 h-4 text-red-600" />
                                <span className="font-medium">NIE:</span>
                              </div>
                              <div className="flex-1 h-6 bg-red-200 rounded overflow-hidden">
                                <div
                                  className="h-full bg-red-500"
                                  style={{ width: total > 0 ? `${(noCount / total) * 100}%` : '0%' }}
                                />
                              </div>
                            </div>
                            <span className="font-bold ml-2 w-8 text-right">{noCount}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {locationOptions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    Wyniki dla lokalizacji
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {locationOptions.map((option) => {
                    const yesCount = getVoteCount(option.id, 'yes');
                    const maybeCount = getVoteCount(option.id, 'maybe');
                    const noCount = getVoteCount(option.id, 'no');
                    const total = votes.filter(v => v.location_option_id === option.id).length;

                    return (
                      <div key={option.id} className="p-4 border rounded-lg bg-emerald-50">
                        <div className="font-medium mb-2">{option.location}</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-24 flex items-center gap-1">
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="font-medium">TAK:</span>
                              </div>
                              <div className="flex-1 h-6 bg-emerald-200 rounded overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500"
                                  style={{ width: total > 0 ? `${(yesCount / total) * 100}%` : '0%' }}
                                />
                              </div>
                            </div>
                            <span className="font-bold ml-2 w-8 text-right">{yesCount}</span>
                          </div>
                          {yesCount > 0 && (
                            <div className="text-xs text-gray-600 ml-24">
                              Głosy: {getVotersByOption(option.id, 'yes').map(name => (
                                <Badge key={name} variant="secondary" className="mr-1 mb-1">
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-24 flex items-center gap-1">
                                <HelpCircle className="w-4 h-4 text-orange-600" />
                                <span className="font-medium">MOŻE:</span>
                              </div>
                              <div className="flex-1 h-6 bg-orange-200 rounded overflow-hidden">
                                <div
                                  className="h-full bg-orange-500"
                                  style={{ width: total > 0 ? `${(maybeCount / total) * 100}%` : '0%' }}
                                />
                              </div>
                            </div>
                            <span className="font-bold ml-2 w-8 text-right">{maybeCount}</span>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-24 flex items-center gap-1">
                                <X className="w-4 h-4 text-red-600" />
                                <span className="font-medium">NIE:</span>
                              </div>
                              <div className="flex-1 h-6 bg-red-200 rounded overflow-hidden">
                                <div
                                  className="h-full bg-red-500"
                                  style={{ width: total > 0 ? `${(noCount / total) * 100}%` : '0%' }}
                                />
                              </div>
                            </div>
                            <span className="font-bold ml-2 w-8 text-right">{noCount}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {votes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    Głosy uczestników
                  </CardTitle>
                  <CardDescription>
                    Anonimizacja: Uczestnicy będą musieli podać swoje imię przed głosowaniem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {uniqueParticipants.map((name) => (
                      <Badge key={name} variant="secondary" className="mr-2">
                        {name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Udostępnij ankietę</DialogTitle>
              <DialogDescription>
                Skopiuj poniższy link i wyślij go uczestnikom spotkania
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Link do ankiety</Label>
                <div className="flex gap-2 mt-2">
                  <Input value={getShareLink()} readOnly />
                  <Button onClick={handleCopyLink} size="icon">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {invitationText && (
                <div>
                  <Label>Tekst zaproszenia (wygenerowany przez AI)</Label>
                  <Textarea
                    value={invitationText}
                    onChange={(e) => setInvitationText(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(invitationText);
                      toast.success('Tekst skopiowany!');
                    }}
                    className="mt-2"
                  >
                    Kopiuj tekst
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
