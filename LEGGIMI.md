# 🚀 APEX TRADER — Guida all'installazione

## Perché un server locale?

Quando apri un file HTML direttamente in Chrome (`file://...`), il browser blocca
le chiamate alle API esterne per motivi di sicurezza (CORS).
Il server locale risolve questo problema facendo da intermediario.

---

## ✅ Requisiti

- **Node.js** installato sul tuo PC
  → Scarica da: https://nodejs.org (versione LTS consigliata)

---

## 🟢 Avvio su Windows

1. Estrai questa cartella dove vuoi (es. `C:\apex-trader\`)
2. Doppio click su **`AVVIA.bat`**
3. Apparirà una finestra nera con il messaggio:
   ```
   ✅ APEX TRADER avviato!
   👉 Apri nel browser: http://localhost:3000
   ```
4. Apri Chrome e vai su → **http://localhost:3000**
5. Inserisci la tua **API Key Anthropic** nel campo in alto

---

## 🍎 Avvio su Mac / Linux

1. Apri il **Terminale**
2. Entra nella cartella:
   ```bash
   cd /percorso/della/cartella/apex-trader
   ```
3. Rendi eseguibile lo script (solo la prima volta):
   ```bash
   chmod +x avvia.sh
   ```
4. Avvia:
   ```bash
   ./avvia.sh
   ```
   oppure direttamente:
   ```bash
   node server.js
   ```
5. Apri Chrome e vai su → **http://localhost:3000**

---

## 🔑 API Key Anthropic

1. Vai su https://console.anthropic.com/
2. Crea un account o accedi
3. Vai su **API Keys** → **Create Key**
4. Copia la chiave (inizia con `sk-ant-...`)
5. Incollala nel campo giallo in cima all'app

> La chiave viene conservata solo nella sessione del browser, non viene salvata su file.

---

## ❌ Fermare il server

- **Windows**: chiudi la finestra nera, oppure premi `CTRL+C`
- **Mac/Linux**: nel terminale premi `CTRL+C`

---

## 📁 File inclusi

```
apex-trader/
├── server.js      ← Server Node.js (proxy API)
├── index.html     ← Interfaccia web dell'applicazione
├── AVVIA.bat      ← Avvio rapido Windows
├── avvia.sh       ← Avvio rapido Mac/Linux
└── LEGGIMI.md     ← Questa guida
```

---

## ⚠️ Disclaimer

Le analisi generate dall'AI sono puramente informative e **NON costituiscono
consulenza finanziaria**. Prima di effettuare qualsiasi operazione finanziaria,
consulta un consulente finanziario abilitato.
