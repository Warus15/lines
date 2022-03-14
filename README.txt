==================================================================================================================

Z bazy zrobione:

[+50% bazy] - odpowiedni podział projektu celem zastosowania obiektowości TS i jej stosowanie wraz z typowaniem => tematyka lekcji 1
[+20% bazy] - patrz wszystkie wytyczne "TS" z lekcji 2 (interfejsy, zasięgi, modyfikatory, static)
[+20% bazy] - użycie jakiegokolwiek module loader'a (np. webpack'a) celem stosowania w projekcie modułów (podział projektu na kilka plików ts)
		      samo zastosowanie modułów w przeglądarce bez loder'a to za mało
[+10% bazy] - wykorzystanie co najmniej jednego z poniższych dekoratorów:
              a) dekorator klasy
              b) dekorator metody z/bez przesłanymi do niej danymi
              c) dekorator właściwości

Łącznie: 100%

Od strony działania zrobione:

[3p] dowlony działający algorytm PathFinding'u
[0.5p] zrealizowanie losowych kul wraz z ich prezentacją na planszy
[1.5p] zralizowanie zachowania kuli (przemieszczanie wraz z szarym śladem (patrz film z l.3), zaznaczanie, odznaczanie itd.)
[1p] preview kul + ich dodawanie w losowych miejscach na planszę
[1.5p] odpowiedni preview ścieżki po najechaniu na pole (bez lagowań)
[1.5p] zbijanie minimum pięciu kul we wszystkich kierunkach wraz z "przecięciami"
[1p] punkty (każda zbita kula - 1p) + zakończenie np. informacja o uzyskanych punktach/czasie gry itp.

Łącznie: 10p

==================================================================================================================

////////////////////////////////////////////////////////////////////////////////////////

Spis treści:

1. PathFinding
2. Dekoratory
3. Interfejsy
4. Module Loader
5. Zbijanie kulek
6. Zakończenie gry
7. Ułatwienie testowania

////////////////////////////////////////////////////////////////////////////////////////

==========
1. PathFinding
==========

W grze zasotosowałem algorytm PathFindingu który napisałem w zeszłym roku do pana Stefańczyka. Wzorowany był na algorytmie Dijkstry, jednak ze względu na uproszczone warunki został on lekko zmodyfikowany (np. odległości zostały przyjęte za 1 i nie są zapisane w węzłach). Krótki opis działania:

1. Tworzymy dwuwymiarową tablicę węzłów (interfejs Node), każdemu przypisujemy odległość od punktu startowego na 999 (podobnie jak w algorytmie Dijkstry, jednak tutaj nie pomijam początkowego węzła). 

2.  Wywołujemy funkcję calculateNodeDistance dla początkowego węzła, która oblicza dystans do węzła początkowego oraz rekurencyjnie wywołuje się dla "sąsiadów". Do tego celu służy zmienna distanceFromStart ustawiona na początku na 0. Funkcja ta wykonuje następujące czynności:

a) Ustawia flagę visited węzła na true
b) Jeżeli aktualny dystans do węzła początkowego, przekazany jako argument, jest mniejszy niż ten przechowywany w danym węźle, podmienia go
c) Ustawia pole path węzła na węzeł, który wywołał funkcję - służy to do ustalenia ścieżki
d) Inkrementuje zmienną distance
e) Wywołuje się rekurencyjnie dla "sąsiadów" węzła, jeżeli dany "sąsiad" nie był jeszcze sprawdzony (flaga visited), lub był sprawdzony, jednak przechowywana w nim odległość do węzła początkowego jest większa niż aktualna. Porównanie odległości jest kluczowym momentem algorytmu i to ono decyduje, który węzeł zostanie ustawiony jako poprzedni. Bez tego sprawdzenia może dojść do sytuacji, gdzie dłuższa ścieżka zostanie sprawdzona jako kolejna, przez co wartości się nadpiszą.

Funkcja przyjmuje jako argument współrzędne x oraz y (jako współrzędne w tablicy) węzła do sprawdzenia, współrzędne x oraz z poprzedniego węzła (tego który wywołał funkcję, w celu aktualizacji ścieżki), oraz dystans do węzła początkowego, inkrementowany w każdym wywołaniu funkcji (przyjąłem że odległość między węzłami wynosi 1, także w każdym kroku "oddalamy się" o 1 od węzła początkowego).

3. Po ukończeniu wywołań rekurencyjnych sprawdzamy, czy ścieżka została znaleziona - jako że zaczynamy poszukiwanie od węzła początkowego wystarczy sprawdzić, czy węzeł końcowy posiada uzupełnione pole path - jeżeli nie, oznacza że algorytm do niego nie dotarł, jeżeli zaś zawiera ono poprzedni węzeł, oznacza to, że algorytm znalazł ścieżkę.

4. Jeżeli ścieżka została znaleziona, wywoływana jest funkcja getPath, która ma bardzo proste zadanie - zaczynając od węzła końcowego sprawdza, który węzeł został ustawiony jako poprzedni, a następnie wpisuje go do tablicy ścieżki. Następnie robi to samo dla poprzedniego węzła. Całość jest realizowana w pętli do{}while(); do momentu, aż algorytm trafi na węzeł początkowy. Po znalezieniu ścieżki flaga pathFound zostaje ustawiona na true.

5. Po znalezieniu ścieżki wywoływana jest funkcja highlightPath, która podświetla ścieżkę

=========
2. Dekoratory
=========

W grze wykorzystałem dwa dekoratory metody:

showMotivationalQuote - dekorator wyświetla cytaty z gry Getting Over It na dole ekranu

highlightCurrentTile - dekorator powoduje podświetlenie na fioletowo pola nad którym aktualnie znajduje się myszka (o ile istnieje do niego ścieżka

========
3. Interfejsy
========

Ogólnie w projekcie występuje 5 interfejsów, 2 większe, oraz 3 pomniejsze:

INTERFEJSY TYPÓW:

SquareField - Główny interfejs gry, na którym opiera się cała tablica reprezentująca planszę (boardRepresentation)

Node - interfejs określający węzeł wykorzystywany w algorytmie PathFindingu

Coords - interfejs określający koordynaty (jednocześnie implementowany w klasie Tile oraz Orb)

Quote - interfejs określający cytat (cytat, autor)

Time - interfejs określający czas (minuty i sekundy)

INTERFEJSY METOD:

ConvertTime - Służy do zamiany czasu z sekund na minuty

RandomNumber - Zwraca losową liczbę z podanego zakresu

INTERFEJS TABLICY:

BoardArray - Definiuje główną tablicę gry


============
4. Module Loader
============

Jako Module Loader zastosowany został WebPack

===========
5. Zbijanie kulek
===========

Zbijanie zrealizowane jest rekurencyjnie, rzędem, kolumną, oraz dwoma przekątnymi. Dodatkowo algorytm uruchmiany jest podczas dodawania nowych kulek - jeżeli nowododane kulki utworzą ciąg 5 lub więcej kulek, zostaną automatycznie zbite (sytuacja ta nie dotyczy końca gry, gdzie na planszy zostaje <=3 wolnych miejsc - wtedy gra dobiega końca)

============
6. Zakończenie gry
============

Gra kończy się, gdy w momencie po ostatnim ruchu ilość wolnych miejsc na planszy jest mniejsza lub równa 3 (dochodzi wtedy do przepełnienia)
UWAGA: Pojawia się wtedy komunikat o przegranej, natomiast nowe kulki nie są już dodawane na planszę! Jest natomiast wyczyszczony preview

================
7. Ułatwienie testowania
================

W celu ułatwienia testowania można wykonać następujące czynności:

W klasie Settings zmniejszyć wartość zmiennej timeoutValue - powoduje ona skrócenie timeoutów w całej grze (poza timeoutem przy zbijaniu nowo dodanych kulek)

W klasie Settings zmniejszyć wartość zmiennej OrbsToPop - określa ona ile kulek trzeba ustawić, aby nastąpiło zbicie


