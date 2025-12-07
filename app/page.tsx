'use client';

import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Kiedy/gdzie spotkanie?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Zaplanuj spotkanie z grupą w prosty sposób. Bez rejestracji, bez komplikacji.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle>Utwórz spotkanie</CardTitle>
                <CardDescription>
                  Dodaj tytuł, opis i propozycje terminów oraz lokalizacji
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle>Udostępnij link</CardTitle>
                <CardDescription>
                  Wyślij unikalny link uczestnikom spotkania
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle>Zbierz głosy</CardTitle>
                <CardDescription>
                  Uczestnicy głosują na preferowane terminy i miejsca
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Link href="/create">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Utwórz nową ankietę
              </Button>
            </Link>
            <p className="text-sm text-gray-500">
              Nie wymaga rejestracji ani logowania
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-emerald-900">Wsparcie AI</CardTitle>
              </div>
              <CardDescription className="text-emerald-700">
                Nasza aplikacja wykorzystuje sztuczną inteligencję do:
              </CardDescription>
            </CardHeader>
            <CardContent className="text-emerald-800">
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Sugerowania optymalnych terminów spotkań</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Proponowania odpowiednich lokalizacji</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Analizy wyników głosowania i rekomendacji najlepszych opcji</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Generowania treści zaproszeń dla uczestników</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
