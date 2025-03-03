export interface feature {
  id: number;
  title: string;
  description: string;
}

export const features: feature[] = [
  {
    id: 0,
    title: "Custom Prefix",
    description:
      "Con la funzionalità del prefisso custom, puoi personalizzare l’inizio dei tuoi link corti per renderli più riconoscibili e brandizzati. Invece di avere un link generico, avrai il controllo sul prefisso, rendendo il tuo URL più professionale e facile da ricordare.",
  },
  {
    id: 1,
    title: "Password",
    description:
      "Mantieni il controllo sui tuoi link con l'ausilio di una password! Questa opzione ti permette di impostare una password per accedere al contenuto del link creato, garantendo maggiore sicurezza e privacy.",
  },
  {
    id: 2,
    title: "Expiration Time",
    description:
      "Grazie alla possibilità di definire il tempo di scadenza, puoi impostare una durata limite per i tuoi link corti (definendo una data e un orario specifici), dopo la quale non saranno più accessibili. Questo è perfetto per condividere contenuti temporanei senza doverli eliminare manualmente!",
  },
  {
    id: 3,
    title: "History",
    description:
      "Accedendo alla propria cronologia, è possibile tenere traccia di tutti i tuoi link accorciati in un’unica dashboard. Avrai accesso a un elenco dettagliato con informazioni utili per gestire e modificare al meglio i tuoi URL.",
  },
  {
    id: 4,
    title: "Note",
    description:
      "Creando molti link, potrebbe essere utile aggiungere annotazioni personali a ciascuno di essi, rendendo più semplice la gestione e l'organizzazione dei tuoi URL.",
  },
  {
    id: 5,
    title: "Enable/Disable",
    description:
      "Con questa funzionalità, puoi attivare o disattivare un link corto in qualsiasi momento, senza eliminarlo definitivamente. Questo ti permette di avere un controllo totale sulla disponibilità del link.",
  },
  {
    id: 6,
    title: "Update Expiration Time",
    description:
      "Accedendo alla propria area profilo sarà possibile aggiornare il tempo di scadenza, in questo modo puoi modificare facilmente la data o il limite di accesso del tuo link senza doverne generare uno nuovo.",
  },
  {
    id: 7,
    title: "Statistics",
    description:
      "Monitora le performance dei tuoi link e ottieni insight. Sarà possibile visualizzare informazioni riguardanti il tuo profilo o specifici di ogni singolo link creato.",
  },
];
