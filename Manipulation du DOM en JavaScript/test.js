// DOM Manipulation en JavaScript - Exemples pratiques

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {

    // ======================================================
    // 1. ACCÉDER AUX ÉLÉMENTS DU DOM
    // ======================================================
    
    // Référence au bouton et à la zone de résultat
    const btnSelection = document.getElementById('btn-selection');
    const selectionResult = document.getElementById('selection-result');
    
    btnSelection.addEventListener('click', function() {
        // Vider le résultat précédent
        selectionResult.innerHTML = '';
        
        // 1.1 getElementById - Sélectionne un élément par son ID (retourne un seul élément)
        const elementById = document.getElementById('para-id');
        elementById.classList.add('highlight');
        addResult(selectionResult, 'getElementById("para-id"):', elementById.textContent);

        // 1.2 getElementsByClassName - Sélectionne des éléments par leur classe (retourne une HTMLCollection)
        const elementsByClass = document.getElementsByClassName('para-class');
        addResult(selectionResult, 'getElementsByClassName("para-class"):', `${elementsByClass.length} éléments trouvés`);
        
        // 1.3 getElementsByTagName - Sélectionne des éléments par leur balise (retourne une HTMLCollection)
        const elementsByTag = document.getElementsByTagName('span');
        elementsByTag[0].classList.add('red');
        addResult(selectionResult, 'getElementsByTagName("span"):', elementsByTag[0].textContent);
        
        // 1.4 querySelector - Sélectionne le premier élément correspondant au sélecteur CSS
        const elementByQuery = document.querySelector('[data-test="selection-test"]');
        addResult(selectionResult, 'querySelector("[data-test=\'selection-test\'"):', elementByQuery.textContent);
        
        // 1.5 querySelectorAll - Sélectionne tous les éléments correspondant au sélecteur CSS (retourne une NodeList)
        const elementsByQueryAll = document.querySelectorAll('.para-class');
        addResult(selectionResult, 'querySelectorAll(".para-class"):', `${elementsByQueryAll.length} éléments trouvés`);
        
        // Retirer la mise en évidence après 2 secondes
        setTimeout(() => {
            elementById.classList.remove('highlight');
        }, 2000);

        // Retirer la mise en évidence après 2 secondes
        setTimeout(() => {
            elementsByTag[0].classList.remove('red');
        }, 2000);
    });
    
    // ======================================================
    // 2. MODIFIER LE CONTENU ET LES ATTRIBUTS
    // ======================================================
    
    const contentText = document.getElementById('content-text');
    const contentHtml = document.getElementById('content-html');
    const contentImg = document.getElementById('content-img');    
    
    // 2.1 Modifier le contenu texte (textContent)
    document.getElementById('btn-text').addEventListener('click', function() {
        // textContent modifie uniquement le texte, sans interpréter le HTML
        contentText.textContent = 'Texte modifié avec textContent - <strong>pas interprété comme HTML</strong>';
        contentText.classList.add('btn-text');
        // Alternative: innerText (similaire mais tient compte de la visibilité CSS)
        // contentText.innerText = 'Texte modifié avec innerText';
    });
    
    // 2.2 Modifier le contenu HTML (innerHTML)
    document.getElementById('btn-html').addEventListener('click', function() {
        // innerHTML interprète le contenu comme du HTML
        contentHtml.innerHTML = 'Contenu modifié avec <strong>innerHTML</strong> - <em>interprété comme HTML</em>';
    });
    
    // 2.3 Modifier les attributs
    document.getElementById('btn-attr').addEventListener('click', function() {
        // Méthode setAttribute
        contentImg.setAttribute('src', 'WhatsApp Image 2025-03-22 at 11.18.55.jpeg');
        contentImg.setAttribute('alt', 'Image modifiée');
        
        // Alternative: accès direct aux attributs
        // contentImg.src = 'https://via.placeholder.com/150/ff0000';
        // contentImg.alt = 'Image rouge';
        
        // Obtenir un attribut
        alert('Nouvel attribut alt: ' + contentImg.getAttribute('alt'));
    });
    
    // 2.4 Modifier les classes
    document.getElementById('btn-class').addEventListener('click', function() {
        // Utilisation de className (remplace toutes les classes)
        contentText.className = 'highlight';
        
        // Après 1 seconde, utiliser classList pour ajouter une classe sans écraser les existantes
        setTimeout(() => {
            contentHtml.className = 'highlight';
        }, 1000);
    });
    
    // ======================================================
    // 3. MODIFIER LE STYLE
    // ======================================================
    
    const styleBox = document.getElementById('style-box');
    
    // 3.1 Style inline
    document.getElementById('btn-style').addEventListener('click', function() {
        // Modification directe des propriétés CSS
        styleBox.style.backgroundColor = '#9b59b6';
        styleBox.style.color = 'white';
        styleBox.style.borderRadius = '50%';
        styleBox.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
    });
    
    // 3.2 Ajouter une classe
    document.getElementById('btn-class-add').addEventListener('click', function() {
        // Ajouter une classe avec classList.add()
        styleBox.classList.add('red');
    });
    
    // 3.3 Supprimer une classe
    document.getElementById('btn-class-remove').addEventListener('click', function() {
        // Supprimer une classe avec classList.remove()
        styleBox.classList.remove('red');
    });
    
    // 3.4 Toggle une classe
    document.getElementById('btn-class-toggle').addEventListener('click', function() {
        // Basculer une classe avec classList.toggle()
        styleBox.classList.toggle('big');
        
        // Vérifier si une classe existe
        if (styleBox.classList.contains('big')) {
            styleBox.textContent = 'Je suis grand!';
        } else {
            styleBox.textContent = 'Style Box';
        }
    });
    
    // ======================================================
    // 4. CRÉER, INSÉRER ET SUPPRIMER DES ÉLÉMENTS
    // ======================================================
    
    const elementsContainer = document.getElementById('elements-container');
    let newParagraph = null;
    
    // 4.1 Créer un élément
    document.getElementById('btn-create').addEventListener('click', function() {
        // Créer un nouvel élément avec createElement
        newParagraph = document.createElement('p');
        newParagraph.textContent = 'Nouveau paragraphe créé dynamiquement';
        newParagraph.className = 'highlight';
        
        // Ajouter l'élément à la fin du conteneur
        elementsContainer.appendChild(newParagraph);
    });
    
    // 4.2 Insérer un élément avant un autre
    document.getElementById('btn-insert').addEventListener('click', function() {
        // Créer un nouvel élément
        const insertedElement = document.createElement('div');
        insertedElement.textContent = 'Élément inséré avant';
        insertedElement.style.color = 'green';
        
        // Référence au premier élément du conteneur
        const firstChild = elementsContainer.firstElementChild;
        
        // Insérer avant le premier élément
        elementsContainer.insertBefore(insertedElement, firstChild);
    });
    
    // 4.3 Supprimer un élément
    document.getElementById('btn-remove').addEventListener('click', function() {
        // Vérifier s'il y a des éléments à supprimer
        if (elementsContainer.children.length > 0) {
            // Supprimer le dernier élément
            const lastChild = elementsContainer.lastElementChild;
            elementsContainer.removeChild(lastChild);
        }
    });
    
    // 4.4 Remplacer un élément
    document.getElementById('btn-replace').addEventListener('click', function() {
        // Vérifier s'il y a des éléments à remplacer
        if (elementsContainer.children.length > 0) {
            // Créer un élément de remplacement
            const replacementElement = document.createElement('div');
            replacementElement.textContent = 'Élément de remplacement';
            replacementElement.className = 'highlight';
            
            // Remplacer le premier élément
            const firstChild = elementsContainer.firstElementChild;
            elementsContainer.replaceChild(replacementElement, firstChild);
        }
    });
    
    // ======================================================
    // 5. GÉRER LES ÉVÉNEMENTS
    // ======================================================
    
    const eventBox = document.getElementById('event-box');
    const eventInput = document.getElementById('event-input');
    const eventLog = document.getElementById('event-log');
    
    // 5.1 Événement click
    eventBox.addEventListener('click', function(event) {
        logEvent('click', 'Position: ' + event.clientX + ',' + event.clientY);
        eventBox.classList.toggle('green');
    });
    
    // 5.2 Événement mouseover/mouseout
    eventBox.addEventListener('mouseover', function() {
        logEvent('mouseover', 'La souris est entrée dans la boîte');
        eventBox.textContent = 'Souris dessus';
    });
    
    eventBox.addEventListener('mouseout', function() {
        logEvent('mouseout', 'La souris a quitté la boîte');
        eventBox.textContent = 'Événements';
    });
    
    // 5.3 Événement keydown sur l'input
    eventInput.addEventListener('keydown', function(event) {
        logEvent('keydown', `Touche: ${event.key}, Code: ${event.code}`);
    });
    
    // 5.4 Événement input (changement de valeur)
    eventInput.addEventListener('input', function() {
        logEvent('input', `Valeur: ${this.value}`);
    });
    
    // ======================================================
    // 6. FORMULAIRES ET VALIDATIONS
    // ======================================================
    
    const validationForm = document.getElementById('validation-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const formResult = document.getElementById('form-result');
    
    // 6.1 Validation à la soumission du formulaire
    validationForm.addEventListener('submit', function(event) {
        // Empêcher l'envoi du formulaire par défaut
        event.preventDefault();
        
        // Réinitialiser les messages d'erreur
        resetErrors();
        
        // Valider les champs
        let isValid = true;
        
        // Validation du nom d'utilisateur
        if (usernameInput.value.length < 3) {
            showError('username-error', 'Le nom d\'utilisateur doit contenir au moins 3 caractères');
            isValid = false;
        }
        
        // Validation de l'email avec une expression régulière
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError('email-error', 'Veuillez entrer une adresse email valide');
            isValid = false;
        }
        
        // Validation du mot de passe
        if (passwordInput.value.length < 6) {
            showError('password-error', 'Le mot de passe doit contenir au moins 6 caractères');
            isValid = false;
        }
        
        // Si tout est valide, afficher un message de succès
        if (isValid) {
            formResult.innerHTML = `
                <div style="color: green; margin-top: 10px;">
                    Formulaire valide! Données soumises:
                    <ul>
                        <li>Nom d'utilisateur: ${usernameInput.value}</li>
                        <li>Email: ${emailInput.value}</li>
                        <li>Mot de passe: ${'*'.repeat(passwordInput.value.length)}</li>
                    </ul>
                </div>
            `;
            validationForm.reset();
        }
    });
    
    // 6.2 Validation en temps réel
    usernameInput.addEventListener('input', function() {
        const usernameError = document.getElementById('username-error');
        if (this.value.length < 3 && this.value.length > 0) {
            usernameError.textContent = 'Trop court (min 3 caractères)';
        } else {
            usernameError.textContent = '';
        }
    });
    
    // ======================================================
    // 7. MANIPULER DES LISTES DYNAMIQUES
    // ======================================================
    
    const listInput = document.getElementById('list-input');
    const btnAddItem = document.getElementById('btn-add-item');
    const dynamicList = document.getElementById('dynamic-list');
    
    // Initialiser la liste avec quelques éléments
    const initialItems = ['Pomme', 'Banane', 'Orange'];
    
    // 7.1 Générer des éléments avec une boucle
    initialItems.forEach(function(item) {
        addListItem(item);
    });
    
    // 7.2 Ajouter un élément à la liste
    btnAddItem.addEventListener('click', function() {
        const newItemText = listInput.value.trim();
        if (newItemText) {
            addListItem(newItemText);
            listInput.value = '';
        }
    });
    
    // Permettre l'ajout en appuyant sur Entrée
    listInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            btnAddItem.click();
        }
    });
    
    // Fonction pour ajouter un élément à la liste dynamique
    function addListItem(text) {
        // Créer un nouvel élément de liste
        const li = document.createElement('li');
        
        // Créer un span pour contenir le texte (pour faciliter l'édition)
        const textSpan = document.createElement('span');
        textSpan.textContent = text;
        textSpan.className = 'item-text';
        li.appendChild(textSpan);
        
        // Ajouter un bouton d'édition
        const editButton = document.createElement('button');
        editButton.textContent = 'Modifier';
        editButton.style.marginLeft = '10px';
        editButton.style.fontSize = '0.8em';
        
        // Ajouter un événement au bouton d'édition
        editButton.addEventListener('click', function() {
            editListItem(li, textSpan.textContent);
        });
        
        // Ajouter un bouton de suppression
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.fontSize = '0.8em';
        
        // Ajouter un événement au bouton de suppression
        deleteButton.addEventListener('click', function() {
            // Supprimer l'élément de liste parent
            li.remove();
            // Alternative: dynamicList.removeChild(li);
        });
        
        // Ajouter les boutons à l'élément de liste
        li.appendChild(editButton);
        li.appendChild(deleteButton);
        
        // Ajouter l'élément à la liste
        dynamicList.appendChild(li);
    }
    
    // Fonction pour éditer un élément de la liste
    function editListItem(listItem, currentText) {
        // Créer un champ de saisie pour l'édition
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';
        
        // Créer un bouton de confirmation
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'OK';
        confirmButton.style.marginLeft = '5px';
        confirmButton.style.fontSize = '0.8em';
        
        // Créer un bouton d'annulation
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Annuler';
        cancelButton.style.marginLeft = '5px';
        cancelButton.style.fontSize = '0.8em';
        
        // Créer un conteneur pour l'édition
        const editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        editContainer.appendChild(input);
        editContainer.appendChild(confirmButton);
        editContainer.appendChild(cancelButton);
        
        // Cacher temporairement le contenu de l'élément
        const children = Array.from(listItem.children);
        children.forEach(child => {
            child.style.display = 'none';
        });
        
        // Ajouter le conteneur d'édition
        listItem.appendChild(editContainer);
        
        // Mettre le focus sur le champ de saisie
        input.focus();
        
        // Gérer la confirmation de l'édition
        confirmButton.addEventListener('click', function() {
            const newText = input.value.trim();
            if (newText) {
                // Mettre à jour le texte
                listItem.querySelector('.item-text').textContent = newText;
            }
            // Nettoyer l'interface d'édition
            finishEditing();
        });
        
        // Gérer l'annulation de l'édition
        cancelButton.addEventListener('click', finishEditing);
        
        // Gérer la touche Entrée et Échap
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                confirmButton.click();
            } else if (event.key === 'Escape') {
                cancelButton.click();
            }
        });
        
        // Fonction pour terminer l'édition
        function finishEditing() {
            // Supprimer le conteneur d'édition
            editContainer.remove();
            
            // Réafficher les éléments cachés
            children.forEach(child => {
                child.style.display = '';
            });
        }
    }
    
    // ======================================================
    // FONCTIONS UTILITAIRES
    // ======================================================
    
    // Fonction pour ajouter un résultat dans la section de sélection
    function addResult(container, title, result) {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `<strong>${title}</strong> ${result}`;
        container.appendChild(resultElement);
    }
    
    // Fonction pour logger un événement
    function logEvent(type, details) {
        const logEntry = document.createElement('div');
        logEntry.innerHTML = `<strong>${type}:</strong> ${details}`;
        eventLog.insertBefore(logEntry, eventLog.firstChild);
        
        // Limiter le nombre d'entrées de log
        if (eventLog.children.length > 5) {
            eventLog.removeChild(eventLog.lastChild);
        }
    }
    
    // Fonction pour afficher une erreur
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
    }
    
    // Fonction pour réinitialiser les erreurs
    function resetErrors() {
        document.querySelectorAll('.error').forEach(function(element) {
            element.textContent = '';
        });
        formResult.innerHTML = '';
    }
});




let fruit = ["apple", "banana", "ananas", "kiwi"];
console.log(fruit);

fruit.push("dela7");
console.log(fruit);

fruit.unshift("l3inab");
console.log(fruit);

fruit.pop();
console.log(fruit);

fruit.shift();
console.log(fruit);

fruit[1] = "tomato";
console.log(fruit);

fruit.sort();
console.log(fruit);

console.log(fruit.includes("apple"));

function displayArray(array) {
    for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
    }
}

displayArray(fruit);

const appleIndex = fruit.indexOf("apple");
console.log("Index of apple:", appleIndex);


console.log(fruit.join(", "));

console.log(fruit.map((x => x+x)));

fruit.reverse();
console.log(fruit);

const longFruits = fruit.filter(item => item.length > 5);
console.log("Fruits with more than 5 letters:", longFruits);

console.log("Number of fruits:", fruit.length);

// fruit = fruit.map(item => item.toUpperCase());
// console.log(fruit);

let findwrd = "kiwi";
let count = fruit.filter(word => word === findwrd).length;
console.log(count);


// Display each word with its index using forEach
console.log("\nEach word with its index:");
fruit.forEach((word, index) => {
    console.log(index + ": " + word);
});


// Display each word with its index using for loop
console.log("\nEach word with its index:");
for (let i = 0; i < fruit.length; i++) {
    console.log(i + ": " + fruit[i]);
}

// Display each word with its index using for...of loop
console.log("\nEach word with its index:");
for (const [index, word] of fruit.entries()) {
    console.log(index + ": " + word);
}


