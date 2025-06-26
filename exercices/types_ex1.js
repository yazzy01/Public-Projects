// Types de données - Exercice 1
// Vérifiez si la variable suivante est un tableau :   
var arr = [1, 2, 3];

// Méthode 1: Utiliser Array.isArray()
// C'est la méthode recommandée et la plus claire
console.log("Méthode 1 - Array.isArray():");
console.log(Array.isArray(arr)); // Retourne true si arr est un tableau

// Méthode 2: Utiliser instanceof
// Vérifie si l'objet est une instance de la classe Array
console.log("\nMéthode 2 - instanceof:");
console.log(arr instanceof Array); // Retourne true si arr est un tableau

// Méthode 3: Utiliser Object.prototype.toString
// Cette méthode est plus avancée mais fonctionne dans tous les contextes
console.log("\nMéthode 3 - Object.prototype.toString:");
console.log(Object.prototype.toString.call(arr) === '[object Array]');

// Méthode 4: Vérifier la propriété length (moins fiable)
// Note: Cette méthode n'est pas fiable car d'autres objets peuvent avoir une propriété length
console.log("\nMéthode 4 - Vérifier la propriété length (moins fiable):");
console.log(typeof arr === 'object' && arr.length !== undefined);

// Test avec d'autres types de variables pour comparaison
var notArr1 = "Ceci est une chaîne";
var notArr2 = { length: 3 }; // Un objet avec une propriété length

console.log("\nTests avec d'autres types de variables:");
console.log("Est-ce que 'Ceci est une chaîne' est un tableau?", Array.isArray(notArr1));
console.log("Est-ce que { length: 3 } est un tableau?", Array.isArray(notArr2));
