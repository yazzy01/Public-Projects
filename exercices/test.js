
// 3. Operations 
// Exercice 0:  

let a = 1.5;   
let b = 100;   
let result = a + b;

// Utilisez console.log pour afficher les résultats
console.log("Résultat: " + result + "£");

// 1. Variables - Exercice 1

// Déclaration et assignation des variables
let nom = "Yassir"; 
let age = 28;       

// Affichage dans la console
console.log("Nom:", nom);
console.log("Age:", age);

// Vous pouvez aussi afficher les deux ensemble
console.log("Je m'appelle " + nom + " et j'ai " + age + " ans.");

// Une façon plus moderne d'afficher avec les template literals (backticks)
console.log(`Je m'appelle ${nom} et j'ai ${age} ans.`);


// 1. Variables - Exercice 2:  

let c = 15;
let d = 20;
let temp = c;
c = d;
d = temp;



console.log("c: " , c);
console.log("d: " , d);

//debugger;

//1. Variables - Exercice 3: 

//const country = "Morocco";
//console.log("Country: " + country);


//let country = "cote ivoire";
//console.log("Country: " + country); 


// 1. Variables - Exercice 4: 

let largeur = 10;
let longeur = 20;
let aire = largeur * longeur;

console.log("Aire: " + aire);


// 2. Types de données - Exercice 1: 

var f = 42; 
var h = "Biiijour"; 
var o = true; 

console.log("number: " + f);
console.log("string: " + h);
console.log("boolean: " + o);


// 2. Types de données - Exercice 2: 

let i = 2023; 
console.log("année: " + i);


// 2. Types de données - Exercice 3:  

// Vérifiez si la variable suivante est un tableau
var arr = [1, 2, 3]; 

// Méthode 1: Utiliser Array.isArray() (recommandée)
console.log("Est-ce que arr est un tableau? " + Array.isArray(arr));

// Méthode 2: Utiliser instanceof
console.log("Est-ce que arr est une instance de Array? " + (arr instanceof Array));

// Méthode 3: Utiliser Object.prototype.toString
console.log("Vérification avec toString: " + (Object.prototype.toString.call(arr) === '[object Array]'));


// 3. Opérateurs - Exercice 1:  
// Quel est le résultat de "5 + "5" ?

let resultat1 = 5 + "5";
console.log("Le résultat de 5 + \"5\" est: " + resultat1);
console.log("Type du résultat: " + typeof resultat1);

// 3. Opérateurs - Exercice 2:
// Utilisez l'opérateur ternaire pour vérifier si un nombre est pair ou impair.
var nombre = 7;
let parite = nombre % 2 === 0 ? "pair" : "impair";
console.log(nombre + " est un nombre " + parite);

// 3. Opérateurs - Exercice 3:
// Comparez "==" et "===" avec les valeurs "5" et 5
let stringCinq = "5";
let numberCinq = 5;

console.log("\"5\" == 5: " + (stringCinq == numberCinq)); // Compare la valeur (après conversion)
console.log("\"5\" === 5: " + (stringCinq === numberCinq)); // Compare la valeur ET le type

// 3. Opérateurs - Exercice 4:
// Incrémentez une variable "compteur" de 1 en utilisant 3 méthodes différentes
var compteur = 0;

// Méthode 1: opérateur d'incrémentation préfixé
++compteur;
console.log("Après ++compteur: " + compteur);

// Méthode 2: opérateur d'incrémentation postfixé
compteur++;
console.log("Après compteur++: " + compteur);

// Méthode 3: opérateur d'addition avec assignation
compteur += 1;
console.log("Après compteur += 1: " + compteur);

// 4. Conditions - Exercice 1:
// Vérifiez si un nombre est positif, négatif ou nul
var nombre2 = -3;

if (nombre2 > 0) {
  console.log(nombre2 + " est positif");
} else if (nombre2 < 0) {
  console.log(nombre2 + " est négatif");
} else {
  console.log(nombre2 + " est nul");
}

// 4. Conditions - Exercice 2:
// Affichez "Bonjour" si l'heure est avant 12h, sinon "Bonsoir"
let heure = new Date().getHours();
let message = heure < 12 ? "Bonjour" : "Bonsoir";
console.log("Il est " + heure + "h, donc " + message);

// 4. Conditions - Exercice 3:
// Vérifiez si un mot a plus de 5 caractères
var mot = "Javascript";

if (mot.length > 5) {
  console.log("\"" + mot + "\" a plus de 5 caractères (" + mot.length + ")");
} else {
  console.log("\"" + mot + "\" a 5 caractères ou moins (" + mot.length + ")");
}

// 5. Boucles - Exercice 1:
// Affichez les nombres de 1 à 10 avec une boucle "for"
console.log("Nombres de 1 à 10 avec for:");
for (let i = 1; i <= 10; i++) {
  console.log(i);
}

// 5. Boucles - Exercice 2:
// Calculez la somme des nombres de 1 à 100 avec une boucle "while"
let somme = 0;
let j = 1;

while (j <= 100) {
  somme += j;
  j++;
}

console.log("La somme des nombres de 1 à 100 est: " + somme);

// 5. Boucles - Exercice 3:
// Parcourez un tableau avec `for...of` et affichez ses éléments
var classe = ["chadi", "adnane", "yassir"];

console.log("Élèves de la classe:");
for (let eleve of classe) {
  console.log("- " + eleve);
}

// 5. Boucles - Exercice 4:
// Affichez les nombres pairs entre 0 et 20 avec une boucle
console.log("Nombres pairs entre 0 et 20:");
for (let k = 0; k <= 20; k += 2) {
  console.log(k);
}





// Second Part 
// 1. Boucles

// 1.1. Compter de 1 à 10
for (let i = 1; i <=10; i++) {
    console.log(i);
}

// 1.2. Somme des nombres pairs entre 1 et 20
let sommet = 0;
for (let i = 0;  i <=20; i+=2) {
    sommet += i;
}
console.log("la somme des nombres pairs entre 1 et 20 est:" + sommet);

// 1.3. Somme des nombres impairs entre 1 et 20
let somee2= 1;
for (let i = 1; i <= 20; i += 2) {
    somee2 += i;
}
console.log("la somme des nombres impairs entre 1 et 20 est:" + somee2);

//1.4. Table de multiplication

for (let i = 2; i <= 2; i++) 
    for (let j = 1; j <= 10; j++) {
        console.log(i + " * " + j + " = " + (i * j));
}

//1.5. compter les voyelles

let word = "let the dog out";
let count = 0;

for (let i = 0; i < word.length; i++) {
    if (word[i] === "a" || word[i] === "e" || word[i] === "i" || word[i] === "o" || word[i] === "u") {
        count++;
    }
}

console.log("le nombre de voyelles dans \"" + word + "\" est: " + count);



//2. Arrays
// 1. Afficher tous les éléments d’un tableau

let array = ["kassem", "mina", "yassir", "adnane", "chadi"];

for (let i = 0; i < array.length; i++) {
    console.log("- " + array[i]);
}

// 2.1. Ajouter un élément au tableau

array.push("sara");
console.log("Tableau avec l'ajout de 'sara':");
for (let i = 0; i < array.length; i++) {
    console.log("- " + array[i]);
}


    