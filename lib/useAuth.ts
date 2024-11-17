import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Afficher tous les cookies dans la console
    console.log("Cookies :", document.cookie);

    const token = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="))?.split("=")[1];
    
    if (token) {
      try {
        // Décoder le token sans vérifier la signature pour inspecter son contenu
        const decodedToken: any = jwt.decode(token);

        // Afficher le contenu du token dans la console
        console.log(decodedToken);

        // Vérifier la validité du token
        jwt.verify(token, process.env.JWT_SECRET!);

        // Vérifier si le token n'est pas expiré
        const currentTime = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Token invalide ou expiré", err);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
      console.log("Pas de token trouvé");
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;


// import { useState, useEffect } from "react";
// import jwt from "jsonwebtoken";

// const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = document.cookie.split("; ").find((cookie) => cookie.startsWith("token="))?.split("=")[1];

//     if (token) {
//       try {
//         // Vérification du token et récupération de la date d'expiration
//         const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        
//         // Vérifier si le token est expiré (jwt.decode renvoie les informations du token sans vérifier)
//         const currentTime = Date.now() / 1000;
//         if (decodedToken.exp && decodedToken.exp > currentTime) {
//           setIsAuthenticated(true);
//         } else {
//           setIsAuthenticated(false); // Token expiré
//         }
//       } catch (err) {
//         setIsAuthenticated(false); // Token invalide
//       }
//     } else {
//       setIsAuthenticated(false); // Pas de token trouvé
//     }
//   }, []); // Le tableau vide [] garantit que l'effet ne se déclenche qu'une fois au montage

//   return isAuthenticated;
// };

// export default useAuth;