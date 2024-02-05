import mongoose from 'mongoose';

const mongoURI: string = 'tu_mongo_uri';

mongoose.connect(mongoURI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

export default mongoose;
