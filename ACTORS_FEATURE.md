# Zarządzanie Aktorami - Podsumowanie Implementacji

## Co zostało dodane?

### Backend (Python FastAPI) - `api/main.py`

Nowe API endpoints dla zarządzania aktorami:

#### Endpoints dla aktorów:
- `GET /actors` - Pobiera listę wszystkich aktorów
- `GET /actors/{actor_id}` - Pobiera informacje o konkretnym aktorze
- `POST /actors` - Dodaje nowego aktora
- `PUT /actors/{actor_id}` - Aktualizuje dane aktora
- `DELETE /actors/{actor_id}` - Usuwa aktora

#### Endpoints dla przypisywania aktorów do filmów:
- `GET /movies/{movie_id}/actors` - Pobiera aktorów przypisanych do filmu
- `POST /movies/{movie_id}/actors/{actor_id}` - Przypisuje aktora do filmu
- `DELETE /movies/{movie_id}/actors/{actor_id}` - Usuwa aktora z filmu

### Baza danych - `api/init_db.py`

Nowe tabele w bazie danych:
- `actors` - Przechowuje dane o aktorach (id, name)
- `movie_actors` - Tabela pośrednia łącząca filmy i aktorów (movie_id, actor_id)

Uruchom: `python init_db.py` aby zainicjalizować bazę danych

### Frontend (React) - nowe komponenty w `ui/src/`:

1. **ActorForm.js** - Formularz do dodawania nowych aktorów
2. **ActorsList.js** - Lista wszystkich aktorów z opcjami:
   - Przypisz do wybranego filmu
   - Usuń aktora z bazy danych
3. **MovieActors.js** - Lista aktorów przypisanych do wybranego filmu

### Zmiany w istniejących komponentach:

- **App.js** - Główny komponent z obsługą całego zarządzania aktorami
  - Stan dla aktorów i wybranego filmu
  - Funkcje do dodawania/usuwania aktorów
  - Funkcje do przypisywania/usuwania aktorów z filmów
  - Dwukolumnowy layout: filmy + zarządzanie aktorami

- **MovieListItem.js** - Dodany przycisk "Zarządzaj aktorami"

- **MoviesList.js** - Dodana obsługa callback'u do zarządzania aktorami

- **MovieForm.js** - Zmieniony na polski (etykiety i teksty)

## Jak używać?

1. W lewej kolumnie - zarządzanie filmami
2. W prawej kolumnie - zarządzanie aktorami:
   - Dodaj nowego aktora
   - Przeglądaj dostępnych aktorów
   - Kliknij "Zarządzaj aktorami" na filmie w lewej kolumnie
   - Kliknij "Przypisz" przy aktorze aby go dodać do wybranego filmu
   - Kliknij "Usuń z filmu" aby usunąć aktora z filmu

## Wymagania spełnione:
✓ Możliwość dodawania aktorów
✓ Możliwość usuwania aktorów
✓ Możliwość przypisywania aktorów do filmów
✓ Możliwość usuwania przypisanych aktorów
