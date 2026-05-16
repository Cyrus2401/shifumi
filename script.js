let humanImgChoice = document.querySelector('.humanImgChoice')
let IA_choice = document.querySelector('.IA_choice')
let loading_img = document.querySelector('.loading_img')
let arrayImgEmoji = ['✂️', '📄', '🪨'] 

let humanScore_dom = document.getElementById('humanScore')
let IA_Score_dom = document.getElementById('IA_Score')

let notification = document.getElementById('notification')
let modal = document.getElementById('myModal')

let winNumber = 1
let gameActive = true
let isWaitingForIA = false

// Initialisation du jeu
function initGame() {
    do {
        winNumber = prompt("🎯 C'est parti ! Quel nombre faut-il atteindre pour remporter la partie ? (Entre 1 et 10)")
    } while (winNumber == "" || winNumber == null || winNumber > 10 || winNumber < 1 || isNaN(parseInt(winNumber)));
    
    winNumber = parseInt(winNumber)
    
    showMessage(2, `🎮 Le premier à ${winNumber} gagne la partie${winNumber > 1 ? 's' : ''} !`)
}

window.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
    initGame();
})

function showHumanChoice(src, value) {
    if (!gameActive || isWaitingForIA) return;
    
    isWaitingForIA = true;
    
    // Obtenir l'emoji correspondant au choix
    let chosenEmoji;
    switch(value) {
        case 'pierre':
            chosenEmoji = '🪨';
            break;
        case 'papier':
            chosenEmoji = '📄';
            break;
        case 'ciseau':
            chosenEmoji = '✂️';
            break;
    }
    
    // Afficher le choix humain
    humanImgChoice.textContent = chosenEmoji;
    humanImgChoice.setAttribute('value', value);

    processGame()
}

function processGame() {
    // Afficher le loading pour l'IA
    loading_img.style.display = "block"
    IA_choice.style.display = "none"
    
    setTimeout(() => {
        let humanImgChoice2 = humanImgChoice.getAttribute('value')    
        
        // Cacher le loading et afficher le choix
        loading_img.style.display = "none"
        IA_choice.style.display = "flex"

        let random_int = Math.floor(Math.random() * 3)
        let random_emoji = arrayImgEmoji[random_int]
    
        // Afficher le choix de l'IA
        IA_choice.textContent = random_emoji;

        let status = determineWinner(humanImgChoice2, random_emoji)
        
        // Mettre à jour les scores
        if (status === 1) {
            humanScore_dom.innerHTML = parseInt(humanScore_dom.innerHTML) + 1
        } else if (status === -1) {
            IA_Score_dom.innerHTML = parseInt(IA_Score_dom.innerHTML) + 1
        }
        
        showMessage(status)
        checkWinner()

    }, 1000) 

    setTimeout(() => {
        // Vider les choix affichés si le jeu continue
        if (gameActive) {
            humanImgChoice.textContent = '';
            IA_choice.textContent = '';
            notification.setAttribute('class', "")
        }
        isWaitingForIA = false;
    }, 3000)  
}

function determineWinner(humanChoice, iaEmoji) {
    const emojiToChoice = {
        '✂️': 'ciseau',
        '📄': 'papier', 
        '🪨': 'pierre'
    }
    
    const iaChoice = emojiToChoice[iaEmoji]
    
    if (humanChoice === iaChoice) {
        return 0 // Égalité
    }
    
    const winConditions = {
        'pierre': 'ciseau',
        'papier': 'pierre',
        'ciseau': 'papier'
    }
    
    return winConditions[humanChoice] === iaChoice ? 1 : -1
}

function showMessage(status, customMessage = null) {
    if (customMessage) {
        notification.innerHTML = customMessage
        notification.style.backgroundColor = "#4a5568"
        notification.style.color = "#fff"
        notification.setAttribute('class', "show")
        return
    }
    
    if (status === 1) {
        notification.setAttribute('class', "show")
        notification.innerHTML = "🎉 Vous avez gagné ce round !"
        notification.style.backgroundColor = "#48bb78"
        notification.style.color = "#fff" 
    }
    else if (status === -1) {
        notification.setAttribute('class', "show")
        notification.innerHTML = "😔 L'IA a gagné ce round !"
        notification.style.backgroundColor = "#e53e3e"
        notification.style.color = "#fff" 
    }
    else {
        notification.setAttribute('class', "show")
        notification.innerHTML = "🤝 Égalité parfaite !"
        notification.style.backgroundColor = "#ed8936"
        notification.style.color = "#fff" 
    }
}

function checkWinner() {
    const humanScore = parseInt(humanScore_dom.innerHTML)
    const iaScore = parseInt(IA_Score_dom.innerHTML)
    
    if (humanScore === winNumber) {
        gameActive = false
        setTimeout(() => {
            showVictoryModal('human', humanScore, iaScore)
        }, 1500)
    }
    else if (iaScore === winNumber) {
        gameActive = false
        setTimeout(() => {
            showVictoryModal('ia', humanScore, iaScore)
        }, 1500)
    }
}

function showVictoryModal(winner, humanScore, iaScore) {
    modal.classList.remove('hide')
    modal.classList.add('show')
    
    const msgWinner = document.querySelector('.msgWinner')
    const finalScore = document.querySelector('.final-score')
    
    if (winner === 'human') {
        msgWinner.innerHTML = '🏆 Félicitations !<br>Vous avez remporté la partie !'
        finalScore.innerHTML = `Vous ${humanScore} - ${iaScore} IA`
    } else {
        msgWinner.innerHTML = '🤖 L\'IA remporte la partie !<br>Meilleure chance la prochaine fois !'
        finalScore.innerHTML = `IA ${iaScore} - ${humanScore} Vous`
    }
}

function resetGame() {
    // Fermer le modal
    modal.classList.add('hide')
    modal.classList.remove('show')
    
    // Réinitialiser les scores
    humanScore_dom.innerHTML = '0'
    IA_Score_dom.innerHTML = '0'
    
    // Vider les choix
    humanImgChoice.textContent = ''
    IA_choice.textContent = ''
    humanImgChoice.removeAttribute('value')
    
    // Réactiver le jeu
    gameActive = true
    isWaitingForIA = false
    
    // Cacher les notifications
    notification.setAttribute('class', "")
    
    // Demander nouveau nombre de victoires
    setTimeout(() => {
        initGame()
    }, 500)
}