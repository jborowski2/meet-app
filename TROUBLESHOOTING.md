# Troubleshooting Guide

## Formularz nie przechodzi dalej

Jeśli formularz tworzenia spotkania nie przechodzi do następnego kroku, sprawdź poniższe punkty:

### 1. Zaznacz konsolę przeglądarki
1. Otwórz DevTools (F12 na Windows/Linux, Cmd+Option+I na Mac)
2. Przejdź do zakładki "Console"
3. Spróbuj wysłać formularz ponownie
4. Szukaj błędów w konsoli

### 2. Wymagane pola
Upewnij się, że wypełniłeś:
- ✅ **Tytuł spotkania** (pole "Tytuł spotkania *")
- ✅ **Twoje imię/nazwa** (pole "Twoje imię/nazwa *")
- ✅ **Przynajmniej jeden termin LUB lokalizację**
  - Aby dodać termin: kliknij datę/czas w polu "Propozycje terminów"
  - Aby dodać lokalizację: wpisz w polu tekstowym "Propozycje lokalizacji"

### 3. Zmienne środowiskowe
Sprawdź czy `.env` zawiera wszystkie wymagane zmienne:

```bash
cat .env
```

Powinno zawierać:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Jeśli czegoś brakuje, dodaj to ręcznie.

### 4. Baza danych
Sprawdź czy baza danych jest dostępna:

1. Przejdź do https://app.supabase.com
2. Zaloguj się do swojego projektu
3. Sprawdź czy istnieją tabele: `meetings`, `time_options`, `location_options`, `votes`
4. Jeśli nie ma tabel, baza danych nie została prawidłowo skonfigurowana

### 5. Problemy z datą/czasem
Jeśli wybór daty/czasu nie działa:

1. Upewnij się że przeglądarki wspiera `input type="datetime-local"`
  - Chrome, Firefox, Safari (wersje nowe)
  - Edge
  - NIE obsługuje: Internet Explorer

2. Alternatywa: ręcznie wpisz datę w formacie `YYYY-MM-DDTHH:mm`
  - Przykład: `2024-12-25T14:30`

### 6. Restart serwera
Jeśli nic nie pomaga, spróbuj:

```bash
# Zatrzymaj serwer (Ctrl+C)
# Wyczyść cache
rm -rf .next

# Uruchom ponownie
npm run dev
```

## Szczegółowe instrukcje do tworzenia spotkania

### Krok 1: Wypełnij podstawowe informacje
1. Kliknij "Utwórz nową ankietę"
2. W sekcji "Podstawowe informacje":
   - Wpisz tytuł (np. "Spotkanie zespołu")
   - Wpisz opis (opcjonalnie)
   - Wpisz swoje imię/nazwę

### Krok 2: Dodaj terminy (opcjonalnie)
1. W sekcji "Propozycje terminów":
2. Kliknij na puste pole daty/czasu
3. Wybierz datę i godzinę z kalendarza
4. Możesz:
   - Kliknąć "Sugestie AI" aby wygenerować 3 propozycje
   - Dodać więcej terminów klikając "+ Dodaj termin"
   - Usunąć termin klikając na X obok pola

### Krok 3: Dodaj lokalizacje (opcjonalnie)
1. W sekcji "Propozycje lokalizacji":
2. Wpisz nazwę lokalizacji (np. "Kawiarnia przy Rynku")
3. Możesz:
   - Kliknąć "Sugestie AI" aby wygenerować 3 propozycje
   - Dodać więcej lokalizacji klikając "+ Dodaj lokalizację"
   - Usunąć lokalizację klikając na X obok pola

### Krok 4: Wyślij formularz
1. Kliknij "Utwórz ankietę"
2. Czekaj aż pojawi się komunikat "Ankieta utworzona!"
3. Zostaniesz automatycznie przekierowany na stronę z wynikami

## Testy konkretnymi krokami

### Test 1: Podstawowe tworzenie
```
1. Tytuł: "Test spotkania"
2. Organizator: "Jan Testowicz"
3. Termin: Jutro, godzina 14:00
4. Lokalizacja: "Biuro"
5. Kliknij "Utwórz ankietę"
```

### Test 2: Z sugestiami AI
```
1. Tytuł: "Brainstorming zespołowy"
2. Organizator: "Maria Kowalska"
3. Kliknij "Sugestie AI" w sekcji terminów
4. Kliknij "Sugestie AI" w sekcji lokalizacji
5. Kliknij "Utwórz ankietę"
```

### Test 3: Tylko terminy
```
1. Tytuł: "Spotkanie online"
2. Organizator: "Piotr Nowak"
3. Dodaj 3 różne terminy
4. Nie dodawaj lokalizacji
5. Kliknij "Utwórz ankietę"
```

## Logi i debugowanie

### Sprawdzanie logów serwera
```bash
# Logi powinny się wyświetlać w terminalu gdzie uruchomiłeś `npm run dev`
# Szukaj linii zawierających:
# - "Creating meeting:"
# - "Generated unique link:"
# - "Meeting created successfully:"
```

### Logi przeglądarki (DevTools Console)
```javascript
// Powinny zawierać:
// "Submitting form data:"
// "Response status: 200"
// "Meeting created:"
```

## Częste błędy i rozwiązania

| Błąd | Przyczyna | Rozwiązanie |
|------|-----------|-----------|
| "Wypełnij wymagane pola" | Brak tytułu lub organizatora | Dodaj tytuł i imię |
| "Dodaj przynajmniej jeden termin lub lokalizację" | Brak obu | Wybierz datę lub wpisz lokalizację |
| "Nie udało się utworzyć ankiety" | Błąd bazy danych | Sprawdź zmienne env |
| "Meeting not found" | Supabase niedostępny | Sprawdź klucze dostępu |
| Przycisk "Utwórz ankietę" nie reaguje | JavaScript błąd | Otwórz DevTools i sprawdź console |

## Potrzebna pomoc?

1. Sprawdź wszystkie powyższe punkty
2. Otwórz DevTools i pokaż błędy z konsoli
3. Sprawdź czy wszystkie zmienne środowiskowe są ustawione
4. Spróbuj innej przeglądarki
5. Wyczyść cache przeglądarki i spróbuj ponownie

## Status aplikacji

- ✅ Baza danych: Skonfigurowana
- ✅ Zmienne środowiskowe: Wymagane (patrz pkt. 3)
- ✅ API: Działające
- ✅ Frontend: Kompiluje się bez błędów
- ✅ Build: Sukces

Jeśli wszystkie powyższe punkty są spełnione, aplikacja powinna działać prawidłowo!
