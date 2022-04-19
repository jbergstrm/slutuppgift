# Slutuppgift

Kursen slutuppgift går ut på att bygga en chat-applikation med `HTML`, `CSS` och `JavaScript`.

1. [Bedömning](#bedömning)
1. [Installation](#installation)
1. [Utveckling](#utveckling)
1. [API](#api)
    1. [Messages](#messages)
    1. [Messages Updated](#messages-updated)
    1. [Messages Append](#messages-append)

<br>

## Bedömning

Slutuppgiften bedöms enligt följande punkter. Uppfylls samtliga punkter har du godkänt (G), men ser jag att du spenderat "det lilla extra" i din applikation kommer det givetvis att avspeglas betyget (VG).

Vid problem eller avsaknad av någon punkt återkopplar jag för att höra dina tankar om implementationen och meddelar om eventuellt komplettering behövs.

**Krav:**

* Använt flertalet av följande element för att skapa ett dokument med beskrivande HTML-struktur.

    ```html
    <main>
    <article>
    <section>
    <aside>
    <header>
    <footer>
    ```

* Använt CSS för att anpassa ett elements utseende.

    _T.ex. Properties som ingår i boxmodel._

* Använt CSS `grid` och `flexbox` för placera element i en layout.

* Använt CSS för att skapa en layout som anpassar sig efter skärmens storlek.

    _Kommer testa applikationen från 320px och uppåt._

* Använt CSS `animation` eller `transition` för att animera ett element.

* Använt CSS `custom property` (aka variabler) som värde för någon property.

* Använt JavaScript för att skapa element i DOM:n.

    _Tänk på att minimera antalet DOM-uppdateringar._

* Använt JavaScript för att reagera på interaktion med ett element.

    _T.ex. när ett formulär skickas eller knapptryckning._

* Använt JavaScript `template literal`.

* Använt JavaScript `fetch` för att hämta meddelanden från API:et.

* Använt JavaScript `fetch` för att skicka in nya meddelande till API:et.

<br>

## Installation

1. Öppna ett `terminal` fönster.

1. Verifiera att `Node.js` _(v16 eller nyare)_ är installerat:

    ```bash
    node -v
    # Bör skriva ut något liknande:
    # v16.14.2
    ```

    _Saknar din dator `Node.js` eller har en äldre version kan du ladda ner `Node.js` från https://nodejs.org/en/download/._

1. Installera dependencies:

    ```bash
    npm ci
    ```

<br>

## Utveckling

1. Öppna ett `terminal` fönster.

1. Gå till `ha-slutuppgift-chat` mappen:

    ```bash
    cd mappen/du/har/ha-slutuppgift-chat
    ```

1. Starta `ha-slutuppgift-chat` utvecklingsserver:

    ```bash
    npm start
    ```

1. Projektet öppnas i webbläsaren.

    _Öppnas inte webbläsaren automatiskt, eller du vill använda annan webbläsare kan du använda någon av de adresser som visas i terminalen._

<br>

## API

För att få igenom requests mot `ha-slutuppgift-chat` API:et behövs authorisering. Det finns många olika sätt API:er sköter detta, men för slutuppgiften har vi en `bearer token` (se `Classroom`) som vi måste skicka med i `Authorization` headern när vi gör ett anrop mot API:et.

**Endpoints:**
1. [Messages](#messages)
1. [Messages Updated](#messages-updated)
1. [Messages Append](#messages-append)

<br>

### Messages

Används för att hämtar de senaste meddelanderna från servern.

**Respons:**

```json
{
  "success": true,
  "messages": [
    {
      "id": <id>,
      "user": <user>,
      "message": <message>,
      "timestamp": <timestamp>
    },
    ...
  ],
  "last": <timestamp> // Bör sparas undan för framtida requests mot /api/messages/updated och /api/messages.
}
```

**URL:**

```
https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages
```

**Metoder:**

| Metod     | Format         |
|-----------|----------------|
| POST      | JSON-body      |
| GET       | Search params  |

**Headers:**

| Header          | Beskrivning    |
|-----------------|----------------|
| `Authorization` | Använd den `Bearer token` som finns i slutuppgiften på `Classroom`. |

**Parametrar:**

| Parameter  | Beskrivning    |
|------------|----------------|
| `limit`    | Antal meddelanden att returnera _(default: 30, max: 30)_ |
| `last`     | Returneras vid varje `/api/messages` request. Bör sparas undan för framtida requests mot `/api/messages/updated` och `/api/messages`. |

<br>

### Messages Updated

Används för att fråga servern om det finns nya meddelanden att hämta.

**Respons:**

```json
{
  "success": true,
  "updated": <true|false> // true = inga nya meddelanden, false = ny meddelanden att hämta.
}
```

**URL:**

```
https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages/updated
```

**Metoder:**

| Metod     | Format         |
|-----------|----------------|
| POST      | JSON-body      |
| GET       | Search params  |

**Headers:**

| Header          | Beskrivning    |
|-----------------|----------------|
| `Authorization` | Använd den `Bearer token` som finns i slutuppgiften på `Classroom`. |

**Parametrar:**

| Parameter  | Beskrivning    |
|------------|----------------|
| `last`     | Returneras vid varje `/api/messages` request. |

<br>

### Messages Append

**Respons:**

```json
{
  "success": true
}
```

**URL:**

```
https://ha-slutuppgift-chat-do.westling.workers.dev/api/messages/append
```

**Metoder:**

| Metod     | Format         |
|-----------|----------------|
| POST      | JSON-body      |
| PUT       | JSON-body      |

**Headers:**

| Header          | Beskrivning    |
|-----------------|----------------|
| `Authorization` | Använd den `Bearer token` som finns i slutuppgiften på `Classroom`. |

**Parametrar:**

| Parameter  | Beskrivning    |
|------------|----------------|
| `user`     | Meddelandets avsändare _(default: Anonymous)_. |
| `message`  | Meddelandetexten. |
