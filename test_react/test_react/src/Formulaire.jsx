import React,{useState} from 'react';
 
function Formulaire() {
    const [Prenom, setPrenom] = useState('');
    const [Email, setEmail] = useState('');
    const [Message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(`Merci ${Prenom}, votre email ${Email} a bien été enregistré.`)
    }

    return(
        <div>
        <div>
            <label htmlFor="Prenom">Prenom</label>
            <input type="text" id="Prenom" value={Prenom} onChange={(e) => setPrenom(e.target.value)} />
        </div>
        <div>
            <label htmlFor="Email">Email</label>
            <input type="email" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <p>{Message}</p>
        <button onClick={handleSubmit} >Envoyer</button>
        </div>
    )
}



export default Formulaire;
