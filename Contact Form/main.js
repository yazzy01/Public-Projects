// Version simplifiée de la validation de formulaire
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer le formulaire et le conteneur de résultat
    const form = document.getElementById('contact-form');
    const resultContainer = document.getElementById('result');
    
    // Règles de validation pour chaque champ
    const validationRules = {
        'first-name': {
            required: true,
            minLength: 6,
            errorMessages: {
                required: 'Le prénom est obligatoire',
                minLength: 'Le prénom doit contenir au moins 6 caractères'
            }
        },
        'last-name': {
            required: true,
            minLength: 6,
            errorMessages: {
                required: 'Le nom est obligatoire',
                minLength: 'Le nom doit contenir au moins 6 caractères'
            }
        },
        'phone': {
            required: false,
            pattern: /^[0-9]{10}$/,
            errorMessages: {
                pattern: 'Le numéro de téléphone doit contenir 10 chiffres'
            }
        },
        'email': {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessages: {
                required: 'L\'email est obligatoire',
                pattern: 'Veuillez entrer une adresse email valide'
            }
        },
        'message': {
            required: true,
            maxLength: 50,
            errorMessages: {
                required: 'Le message est obligatoire',
                maxLength: 'Le message ne doit pas dépasser 50 caractères'
            }
        }
    };
    
    // Fonction générique pour gérer les messages d'erreur
    function handleError(input, message, show) {
        // Trouver ou créer le message d'erreur
        let errorElement = input.parentElement.querySelector('.error-message');
        
        if (show) {
            // Afficher l'erreur
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.style.color = 'red';
                errorElement.style.fontSize = '12px';
                errorElement.style.marginTop = '5px';
                input.parentElement.appendChild(errorElement);
            }
            errorElement.textContent = message;
        } else if (errorElement) {
            // Supprimer l'erreur
            errorElement.remove();
        }
    }
    
    // Fonction générique pour valider un champ
    function validateField(fieldId) {
        const input = document.getElementById(fieldId);
        const value = input.value.trim();
        const rules = validationRules[fieldId];
        
        // Vérifier si le champ est requis et vide
        if (rules.required && value === '') {
            handleError(input, rules.errorMessages.required, true);
            return false;
        }
        
        // Vérifier la longueur minimale
        if (rules.minLength && value.length < rules.minLength) {
            handleError(input, rules.errorMessages.minLength, true);
            return false;
        }
        
        // Vérifier la longueur maximale
        if (rules.maxLength && value.length > rules.maxLength) {
            handleError(input, rules.errorMessages.maxLength, true);
            return false;
        }
        
        // Vérifier le pattern (regex)
        if (rules.pattern && value !== '' && !rules.pattern.test(value)) {
            handleError(input, rules.errorMessages.pattern, true);
            return false;
        }
        
        // Si tout est valide, supprimer les messages d'erreur
        handleError(input, '', false);
        return true;
    }
    
    // Ajouter des écouteurs d'événements pour tous les champs
    Object.keys(validationRules).forEach(fieldId => {
        const input = document.getElementById(fieldId);
        input.addEventListener('input', () => validateField(fieldId));
    });
    
    // Gérer la soumission du formulaire
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Valider tous les champs
        const isValid = Object.keys(validationRules).every(fieldId => validateField(fieldId));
        
        if (isValid) {
            // Afficher un message de succès
            resultContainer.innerHTML = '<p>Formulaire soumis avec succès !</p>';
            resultContainer.style.display = 'block';
            resultContainer.className = 'result-container success';
            
            // Réinitialiser le formulaire
            form.reset();
            
            // Supprimer tous les messages d'erreur
            Object.keys(validationRules).forEach(fieldId => {
                handleError(document.getElementById(fieldId), '', false);
            });
            
            console.log('Formulaire validé et soumis');
        } else {
            // Afficher un message d'erreur général
            resultContainer.innerHTML = '<p>Veuillez corriger les erreurs dans le formulaire.</p>';
            resultContainer.style.display = 'block';
            resultContainer.className = 'result-container error';
            
            console.log('Validation du formulaire échouée');
        }
    });
});