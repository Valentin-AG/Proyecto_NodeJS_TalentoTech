import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) return res.status(401).json({message: "Acceso denegado"});

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch(error){
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado' });
        }
        return res.status(403).json({message: "Token inválido o expirado"});
    }
}

export const checkAdmin = (req, res, next) => {
    if(req.user && req.user.rol === 'admin'){
        next();
    } else {
        res.status(403).json({message: "Acceso denegado. Se requieren permisos de administrador"});
    }
}