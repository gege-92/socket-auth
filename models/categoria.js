const { Schema, model } = require('mongoose');


const CategoriaSchema = new Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true,
    },
    usuario:{  // de mi Schema
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})

//Borrar estado. Sobreescribo un metodo
CategoriaSchema.methods.toJSON = function(){

    const { __v, estado, ...data } = this.toObject();
    return data;
}

module.exports = model('Categoria', CategoriaSchema);