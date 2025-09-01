Meteor.methods({
    'etablissements.insert':function (etablissement) {
      check(etablissement, {
        nom: String,
        type: String,
        region: String,
        ville: String,
        quartier: Match.Maybe(String),
        adresse: Match.Maybe(String),
        telephone: Match.Maybe(String),
        email: Match.Maybe(String),
        siteWeb: Match.Maybe(String),
      });
  
      return Etablissements.insert({
        ...etablissement,
        dateAjout: new Date(),
      });
    },
  
    'etablissements.importCSV':function(csvData) {
      check(csvData, String);
      const parsed = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      });
  
      parsed.data.forEach((row) => {
        if (row.nom && row.type && row.region && row.ville) {
          Etablissements.insert({
            nom: row.nom,
            type: row.type,
            region: row.region,
            ville: row.ville,
            quartier: row.quartier || '',
            adresse: row.adresse || '',
            telephone: row.telephone || '',
            email: row.email || '',
            siteWeb: row.siteWeb || '',
            dateAjout: new Date(),
          });
        }
      });
    },
  
    'etablissements.importXLS':function (base64File) {
      check(base64File, String);
  
      const binary = Buffer.from(base64File, 'base64');
      const workbook = XLSX.read(binary, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
  
      json.forEach((row) => {
        if (row.nom && row.type && row.region && row.ville) {
          Etablissements.insert({
            nom: row.nom,
            type: row.type,
            region: row.region,
            ville: row.ville,
            quartier: row.quartier || '',
            adresse: row.adresse || '',
            telephone: row.telephone || '',
            email: row.email || '',
            siteWeb: row.siteWeb || '',
            dateAjout: new Date(),
          });
        }
      });
    },
  });