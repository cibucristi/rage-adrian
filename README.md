# rage-adrian

Salut, v-am pregatit un nou gamemode de RAGE.MP, o versiune mai avansata fata de primul meu gamemode postat pe internet.

# Instalare:
- descrcati ultimul **release**
- dezarhivati arhiva intr-un folder gol
- utilizand terminalul din VSC (Visual Studio Code) sau Command Promptul (CMD) ul oferit de Microsoft folositi npm install [AVETI NEVOIE DE NODEJS]
- creati fisierul .env in folder unde puneti urmatorul lucru: 
> [SWC]

```
PRODUCTION_MODE=false
COMPILER_USE_SWC=true
```

> [TypeScript]

```
PRODUCTION_MODE=false
COMPILER_USE_SWC=false
```

- iti creezi un db cu orice nume si actualizezi in src/server/class/database.ts
- dupa ce ai modificat tot foloesti in terminal sau in cmd npm run build pentru a construi serverul.
- o sa ti se creeze un folder cu numele dist unde vei fii nevoit sa pui server-files de la RAGE:MP, le poti gasii in folderul unde ai instalat clientul.

### ⚠ Atentie:
Daca nu gasesti folderul server-files in folderul clientului deschide config.xml si schimba din:

```
<?xml version="1.0" encoding="UTF-8"?>
<channel>prerelease</channel>
```

|

```
<?xml version="1.0" encoding="UTF-8"?>
<channel>prerelease_server</channel>
```

Dupa ruleaza updater.exe, asteapta si dupa ce ti-a aparut clientul ia fisierele din server-files si urmeaza ultimul pas. [!] Pe urma actualizeaza din nou config.xml in cel normal.

- ✔


# UPDATES:

- Sistem de inregistrare / logare + creare caracter.
- Sistem de admin / helper cu 50% din comenzile necesare.
- Sistem de interactiune cu actorii + ui special pentru acesta [Credite functionalitate: Adryan]
- Sistem de interactiune cu alte sisteme bazat pe un UI informativ in partea de jos a ecranului.
- Sistem de joburi + job ui (fara cod sursa), am pierdut sursa asa ca va puteti face voi un nou UI special.
- A fost adaugat jobul fisherman la sistemul de joburi.
- A fost adaugat un Command handler pentru comenzile de pe server, in command handler avans posibilitatea de a gestiona permisiunile / statusul comenzii / descrierea cat si aliasurile.
- Sistem de payday odata la o ora (la xx:00).
- Sistem de licente.
- Sistem de driving school.
- Sistem de sanctiuni + ui personalizat (fara cod sursa), am pierdut sursa asa ca va puteti face voi un nou UI special.
- A fost adaugata animatie + drawtext atunci cand mori (primesti respawn dupa cateva secunde).
- Sistem de dialoguri asemanatoare ca pe samp (fara cod sursa), am pierdut sursa asa ca va puteti face voi un nou UI special.

# INFO:
Inainte sa porniti serverul, va recomand sa mergeti in folderul discord acolo unde serverul este conectat la un bot de discord. In caz ca nu vreti sa faceti conectiunea dintre discord si serverul de RAGE.MP puteti sterge import-ul din fisierul index.ts. Daca doriti sa pastrati conectiunea cu discordul, mergeti in folderul discord si in fisierul index.js si modificati tokenul de mai jos cu tokenul botului vostru de discord. Pentru a crea un bot de discord puteti merge pe link-ul acesta: https://discord.com/developers

# EDIT:
- Sistem de business-uri.
- A fost adaugata sursa corecta de la chat.
- Baza de date a fost adaugata in folderul database.

Alte sisteme asemanatoare SAMP (RPG style) le veti descoperi descarcand acest gamemode. Am zis sa postez acest gamemode cu scopul de a ajuta incepatorii sa lucreze in TypeScript si totodata de a va incuraja sa va dezvoltati propriul vostru gamemode. Va puteti inspira din gamemode sau chiar sa-l continuati pe acesta.

Imi pare rau pentru cod, nu este unul tocmai performant insa totusi as dori sa apreciati munca depusa deoarece eram la inceput, mult spor sa aveti!

Daca aveti probleme ma puteti contacta pe discord:

# Adrian_#6651
