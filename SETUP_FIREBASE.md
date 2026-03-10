# 🔥 SETUP FIREBASE — Guida completa

Seguendo questi passaggi in 10 minuti avrai il login Google e il salvataggio
cloud completamente funzionanti. Firebase è **gratuito** per uso personale.

---

## PASSO 1 — Crea un progetto Firebase

1. Vai su → https://console.firebase.google.com
2. Clicca **"Aggiungi progetto"** (o "Create a project")
3. Nome progetto: `apex-trader` (o come vuoi)
4. Disabilita Google Analytics se vuoi (opzionale)
5. Clicca **Crea progetto** e aspetta

---

## PASSO 2 — Aggiungi un'app Web

1. Nella home del progetto, clicca l'icona **`</>`** (Web)
2. Nome app: `apex-trader-web`
3. **NON** spuntare "Firebase Hosting"
4. Clicca **Registra app**
5. Vedrai un blocco di codice tipo:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "apex-trader-xxxxx.firebaseapp.com",
  projectId: "apex-trader-xxxxx",
  storageBucket: "apex-trader-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

6. **Copia questi valori** — ti servono nel passo 5

---

## PASSO 3 — Abilita l'autenticazione Google

1. Nel menu a sinistra: **Authentication** → **Sign-in method**
2. Clicca **Google** nell'elenco dei provider
3. Attiva con il toggle → **Abilita**
4. Inserisci la tua email come "email di supporto per il progetto"
5. Clicca **Salva**

---

## PASSO 4 — Crea il database Firestore

1. Nel menu a sinistra: **Firestore Database**
2. Clicca **Crea database**
3. Scegli **Modalità di produzione** → Avanti
4. Scegli la posizione più vicina a te (es. `eur3` per Europa)
5. Clicca **Crea**

### Configura le regole di sicurezza Firestore

1. Vai su **Firestore** → tab **Regole**
2. Sostituisci il contenuto con queste regole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Clicca **Pubblica**

Queste regole garantiscono che ogni utente possa leggere/scrivere **solo i propri dati**.

---

## PASSO 5 — Configura index.html

1. Apri il file `index.html` con un editor di testo (Notepad, VS Code, ecc.)
2. Trova la sezione con `firebaseConfig` (circa riga 25)
3. Sostituisci i valori `"INSERISCI_QUI"` con i tuoi valori copiati al Passo 2:

```javascript
const firebaseConfig = {
  apiKey:            "AIzaSy...",          // ← incolla il tuo
  authDomain:        "apex-trader-xxxxx.firebaseapp.com",
  projectId:         "apex-trader-xxxxx",
  storageBucket:     "apex-trader-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef"
};
```

4. Salva il file

---

## PASSO 6 — Aggiungi localhost agli domini autorizzati

1. In Firebase Console: **Authentication** → **Settings** → **Domini autorizzati**
2. Verifica che `localhost` sia nell'elenco (di solito c'è già)
3. Se non c'è, clicca **Aggiungi dominio** e inserisci `localhost`

---

## ✅ Test finale

1. Avvia il server: doppio click su `AVVIA.bat` (Windows) oppure `node server.js`
2. Apri Chrome → `http://localhost:3000`
3. Dovresti vedere il pulsante **"ACCEDI CON GOOGLE"**
4. Clicca e accedi con il tuo account Google
5. Inserisci il tuo portafoglio e la API Key
6. Clicca **💾 SALVA** → i dati vengono salvati nel cloud
7. La prossima volta che apri l'app, tutto si carica automaticamente!

---

## 📦 Struttura dati salvata

Per ogni utente viene salvato in Firestore il documento `/users/{uid}`:

```json
{
  "email": "tu@gmail.com",
  "displayName": "Il tuo nome",
  "portfolio": [
    { "ticker": "AAPL", "qty": "50", "price": "185.20" },
    { "ticker": "MSFT", "qty": "30", "price": "415.50" }
  ],
  "apiKey": "sk-ant-...",
  "context": "orizzonte 6 mesi, profilo moderato",
  "savedAt": "2026-03-09T10:30:00Z"
}
```

---

## ❓ Problemi comuni

**"Firebase: Error (auth/unauthorized-domain)"**
→ Aggiungi `localhost` ai domini autorizzati (Passo 6)

**"Missing or insufficient permissions"**
→ Controlla le regole Firestore (Passo 4, sezione regole)

**Il popup Google non si apre**
→ Disabilita temporaneamente il blocco popup del browser per localhost

**"Firebase non configurato" appare ancora**
→ Verifica di aver sostituito tutti i 6 valori `"INSERISCI_QUI"` in index.html

---

## 💰 Costi Firebase

Il piano **Spark (gratuito)** include:
- 50.000 letture Firestore al giorno
- 20.000 scritture al giorno
- Autenticazione illimitata

Per uso personale, non supererai mai questi limiti.
