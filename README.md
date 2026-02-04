# Habit Tracker

Habit Tracker to aplikacja webowa typu fullstack umożliwiająca użytkownikom
śledzenie swoich nawyków, zapisywanie dziennych postępów oraz analizę statystyk.

Projekt został przygotowany w architekturze **frontend + backend**, uruchamianej
w całości za pomocą **Docker Compose**.

## Autor
- Imię i nazwisko: Kyrylo Moiseienko
- Numer indeksu: 55659

## Uruchomienie aplikacji 

### Wymagania
- Docker
- Docker Compose

### Start projektu

Z katalogu głównego projektu:

```bash
docker compose up --build
```

Po uruchomieniu:
- Frontend: http://localhost  
- Backend (API): http://localhost:8000/api/

Aplikacja jest gotowa do użycia bez dodatkowej konfiguracji.

### Zatrzymanie
```bash
docker compose down
```  



## Technologie

**Backend**
- Python 3.13
- Django 6.0
- Django REST Framework
- JWT (SimpleJWT)
- PostgreSQL
- Gunicorn

**Frontend**
- React
- TypeScript
- Vite
- TailwindCSS

**DevOps**
- Docker
- Docker Compose
- Nginx (serwowanie frontendu)



## Funkcjonalności aplikacji

### Autoryzacja (JWT)
- Rejestracja użytkownika
- Logowanie użytkownika
- Automatyczne logowanie po rejestracji
- Ochrona endpointów API
- Ochrona tras frontendu (ProtectedRoute)
- Każdy użytkownik ma dostęp wyłącznie do swoich danych



## CRUD 

### Habits (Nawyki)

**Create**
- Tworzenie nowego nawyku
- Określenie:
  - nazwy
  - daty startu
  - liczby dni celu
  - statusu aktywnego

**Read**
- Pobieranie listy wszystkich nawyków użytkownika
- Wyświetlanie aktywnych i nieaktywnych nawyków
- Widok szczegółów nawyku wraz ze statystykami

**Update**
- Edycja:
  - nazwy
  - celu
  - statusu aktywnego
- Możliwość posiadania wielu aktywnych nawyków jednocześnie

**Delete**
- Usuwanie nawyku wraz z powiązanymi logami



### Daily Logs (Logi dzienne)

**Create**
- Dodanie dziennego wpisu dla konkretnego nawyku
- Status: success / relapse
- Opcjonalna notatka

**Read**
- Pobieranie wszystkich logów użytkownika
- Filtrowanie po nawyku
- Sortowanie po dacie

**Update**
- Edycja istniejącego logu
- Jeden log na dzień dla jednego nawyku
- Próba dodania drugiego logu tego samego dnia powoduje aktualizację istniejącego wpisu

**Delete**
- Usuwanie pojedynczego wpisu dziennego



### Triggers (Wyzwalacze)

**Create**
- Dodawanie własnych wyzwalaczy (np. stres, zmęczenie)

**Read**
- Pobieranie listy wyzwalaczy użytkownika

**Update**
- Edycja nazwy wyzwalacza

**Delete**
- Usuwanie wyzwalacza



### Dashboard

- Zbiorcze statystyki użytkownika
- Liczba aktywnych nawyków
- Łączna liczba dni sukcesu i porażek
- Najlepsza seria (streak)
- Średni procent realizacji celu
- Lista wszystkich nawyków (aktywne wyświetlane jako pierwsze)



## Dane i baza danych

- Dane użytkowników, nawyków i logów przechowywane są w bazie PostgreSQL
- Baza działa w kontenerze Dockera
- Usunięcie wolumenu powoduje utratę danych (co jest akceptowalne w projekcie edukacyjnym)

---

## Logi backendu

- Backend nie wypisuje każdego żądania HTTP
- Logowane są:
  - błędy
  - problemy z autoryzacją
  - start aplikacji



