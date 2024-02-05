import mongoose from '../../config/mongoConnection';

// Ejemplo de uso con un modelo Mongoose
const schema = new mongoose.Schema({
    // Definiciones del esquema
});
const MiModelo = mongoose.model('MiModelo', schema);

// Ejemplo de consulta
MiModelo.find();
