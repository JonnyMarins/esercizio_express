import express from "express";
import fs from "fs";
import path from "path";

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware per il parsing del JSON
app.use(express.json());

const frasiCasuali = [
  "Il sole splende più forte dopo la tempesta.",
  "Chi dorme non piglia pesci.",
  "Ogni viaggio inizia con un singolo passo.",
  "La fortuna aiuta gli audaci.",
  "Non è mai troppo tardi per essere ciò che avresti potuto essere.",
  "Meglio un uovo oggi che una gallina domani.",
  "Chi trova un amico trova un tesoro.",
  "La pazienza è la virtù dei forti.",
  "Non tutto ciò che luccica è oro.",
  "Una risata è la distanza più breve tra due persone.",
];

// Route di test
app.get("/", (req, res) => {
  res.json({ message: "Server funzionante!" });
});

// Route per ottenere una frase casuale
app.get("/frasi", (req, res) => {
  const fraseCasuale =
    frasiCasuali[Math.floor(Math.random() * frasiCasuali.length)];
  res.json({ frase: fraseCasuale });
});

//Route per convertire

app.get("/converti", (req, res) => {
  const { k } = req.query;
  const convert = k * 1000;
  res.json({ message: `${k} chilometri corrisponde a ${convert} metri` });
});

//rotta per somma
app.get("/somma", (req, res) => {
  const { a, b } = req.query;
  const somma = Number(a) + Number(b);
  res.json({ message: `la somma è ${somma}` });
});

//
app.post("/text", (req, res) => {
  const { text } = req.body;
  fs.writeFileSync("./frase.txt", text);
  return res.json({ message: "testo inserito correttamente" });
});

app.delete("/text", (req, res) => {
  const text = "";
  fs.writeFileSync("./frase.txt", text);
  return res.json({ message: "testo eliminato correttamente" });
});

app.get("/text", (req, res) => {
  const filePath = path.join(process.cwd(), "frase.txt"); // Restituisce il percorso assoluto della cartella di lavoro corrente del processo Node.js, cioè la cartella da cui hai eseguito il comando node app.js
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Errore nella lettura del file:", err);
      return res.status(500).json({ errore: "Errore nella lettura del file" });
    }
    if (data.trim() === "") {
      return res.json({ messaggio: "Nessun testo inserito", num_parole: 0 });
    } else {
      const parole = data.split(/\s+/); // Crea un array di parole
      const numParole = parole.length; // Calcola il numero di parole
      const numCaratteri = data.replace(/\s/g, "").length; // Calcola il numero di caratteri
      const numVocali = data.match(/[aeiou]/g).length; // Calcola il numero di vocali
      const numConsonanti = numCaratteri - numVocali; // Calcola il numero di consonanti
      const parolaPiuLunga = data
        .split(/\s+/)
        .reduce((prev, cur) => (cur.length > prev.length ? cur : prev), ""); // Trova la parola più lunga
      const parolaPiuCorta = data
        .split(/\s+/)
        .filter((parola) => parola != "")
        .reduce((prev, cur) => (cur.length < prev.length ? cur : prev)); // Trova la parola più corta
      const conteggioParole = {};
      parole.forEach((parola) => {
        parola = parola.toLowerCase();
        conteggioParole[parola] = (conteggioParole[parola] || 0) + 1;
      });

      let parolaPiuRipetuta = ""; // Parola più ripetuta
      let maxOccorrenze = 0; // Numero di occorrenze della parola più ripetuta

      for (const parola in conteggioParole) {
        if (conteggioParole[parola] > maxOccorrenze) {
          parolaPiuRipetuta = parola;
          maxOccorrenze = conteggioParole[parola];
        }
      }

      return res.json({
        testo: data,
        num_parole: numParole,
        num_caratteri: numCaratteri,
        num_vocali: numVocali,
        num_consonanti: numConsonanti,
        parola_piu_lunga: parolaPiuLunga,
        parola_piu_corta: parolaPiuCorta,
        parola_piu_ripetuta: parolaPiuRipetuta,
        parola_piu_ripetuta_volte: maxOccorrenze,
      });
    }
  });
});

app.post("/text/cambia-parola", (req, res) => {
  const { oldWord, newWord } = req.body;
  const filePath = path.join(process.cwd(), "frase.txt");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Errore nella lettura del file:", err);
      return res.status(500).json({ errore: "Errore nella lettura del file" });
    }
    if (data.trim() === "") {
      return res.json({ messaggio: "Nessun testo inserito", num_parole: 0 });
    } else {
      const newText = data.replace(new RegExp(oldWord, "gi"), newWord);
      fs.writeFileSync("./frase.txt", newText);
      return res.json({ message: "testo inserito correttamente" });
    }
  });
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
