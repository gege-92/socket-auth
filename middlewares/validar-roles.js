const { response } = require("express")




const esAdminRole = (req, res = response, next) => {

    //verificamos el json web token 
    if(!req.usuario){
        return res.status(500).json({
            msg:'Se quiere verificar el rol sin validar el token primero'
        });
    }


    const { rol, nombre } = req.usuario;

    //verificamos si tiene un rol de ADMIN
    if(rol !== 'ADMIN_ROLE'){
        return res.status(500).json({
            msg: `El usuario ${nombre} no es un ADMIN`
        });
    }

    next();
}



const tieneRole = ( ...roles ) => {  //roles -> 'ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'

    return (req, res = response, next) => {

        //verificamos el json web token 
        if(!req.usuario){
            return res.status(500).json({
                msg:'Se quiere verificar el rol sin validar el token primero'
            });
        }

        if( !roles.includes(req.usuario.rol) )
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${ roles }`
            })
            
        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}