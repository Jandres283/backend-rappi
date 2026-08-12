// ./utils/dbHelpers.js

const mongoose = require('mongoose');
const cleanObsoleteIndexes = async () => {

  try {

    const db = mongoose.connection.db;

    const collections = await db.listCollections({ name: 'clients' }).toArray();

   

    if (collections.length > 0) {

      const clientCollection = db.collection('clients');

      const indexes = await clientCollection.indexes();

      const hasEmailIndex = indexes.some(index => index.name === 'email_1');

     

      if (hasEmailIndex) {

        await clientCollection.dropIndex('email_1');

        console.log("🟢 Índice antiguo 'email_1' eliminado con éxito.");

      }

    }

  } catch (err) {

    console.log("🟡 Verificación de índice omitida:", err.message);

  }

};



module.exports = { cleanObsoleteIndexes }; 
 