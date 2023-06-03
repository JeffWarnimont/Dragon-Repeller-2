/* Original html and css provided by Beau Carnes of freecodecamp.org for learning/practice with some small changes made by me. Javascript follow along tutorial for practice/learning syntax. I've expanded on several features and added some new ones of my own design. New features include armor which adds a defensive property and an inn which provides healing services.  Added more weapons and monsters.  Placed a cap on player health and adjusted player and monster damage calcualtions.  Original version battle calculations actually allowed the player to take negative damage after a certain xp threshold which increased health.  Considering adding a 'new game plus' game mode where all monsters get stronger after each dragon is defeated.  Possibly a second mini game as well. This may be put on hold though as I'd prefer to create my own game from scratch now instead of expanding on someone else's starter.  It was fun though :) */
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let currentArmor = 0;
let fighting;
let monsterHealth;
let inventory = ['stick'];
let armorList = [];
const button1 = document.querySelector('#button1');
const button2 = document.querySelector('#button2');
const button3 = document.querySelector('#button3');
const button4 = document.querySelector('#button4');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const monsterStats = document.querySelector('#monsterStats');
const monsterNameText = document.querySelector('#monsterName');
const monsterHealthText = document.querySelector('#monsterHealth');

const weapons = [
    {name: 'stick', power: 5},
    {name: 'club', power: 10},
    {name: 'knife', power: 20},
    {name: 'dagger', power: 40},
    {name: 'mace', power: 50},
    {name: 'sword', power: 100}
    ]
    
const armor = [
    {name: 'helmet', defense: 5},
    {name: 'shield', defense: 5},
    {name: 'gauntlets', defense: 5},
    {name: 'boots', defense: 5},
    {name: 'cuirass', defense: 5},
    {name: 'pauldrons', defense: 5},
    {name: 'greaves', defense: 5}
    ]

const monsters = [
    {name: 'slime', level: 2, health: 15},
    {name: 'wolf', level: 8, health: 60},
    {name: 'vampire', level: 13, health: 160},
    {name: 'dragon', level: 20, health: 300}
    ]
    
const restoratives = [
    {name: 'potion', cost: 10, health: 10},
    {name: 'meal', cost: 15, health: 20},
    {name: 'soak', cost: 30, health: 50},
    {name: 'massage', cost: 70, health: 300}
    ]

const locations = [
    {
      name: 'town square',
      'button text': ['Go to Store', 'Go to Cave', 'Go to Inn', 'Fight Dragon'],
      'button functions': [goStore, goCave, goInn, fightDragon],
      text: 'You are in the town square. You see a store ahead.  There is also an inn that provides healing restoratives.  In the depths of the temple is a cave filled with weak to mid-level monsters.  A powerful dragon blocks the path out of town.'
    },
    {
      name: 'store',
      'button text': ['Buy Heal Potion', 'Buy Weapon (30 Gold)', 'Buy Armor (100 Gold', 'Go to Town Square'],
      'button functions': [buyPotion, buyWeapon, buyArmor, goTown],
      text: 'You enter the store. Health potions and weapons are on display.'
    },
    {
      name: 'cave',
      'button text': ['Fight Slime', 'Fight Wolf', 'Fight Vampire', 'Go to Town Square'],
      'button functions': [fightSlime, fightWolf, fightVampire, goTown],
      text: 'You venture below the temple and enter the cave. You see some monsters, but they haven\'t yet noticed your presence.'
    },
    {
      name: 'fight',
      'button text': ['Attack', 'Kamikaze', 'Dodge', 'Run'],
      'button functions': [attack, kamikaze, dodge, goTown],
      text: 'You launch an attack on the monster.'
    },
    {
      name: 'defeat monster',
      'button text': ['Go to Town Square', 'Fight Slime', 'Fight Wolf', 'Fight Vampire'],
      'button functions': [goTown, fightSlime, fightWolf, fightVampire],
      text: 'The monster dies. You gain gold and experience'
    },
    {
      name: 'lose',
      'button text': ['Try Again?', 'Give it Another Shot?', 'Resurrect to Save the Town?', 'Help the Town?'],
      'button functions': [restart, restart, restart, restart],
      text: 'You died, but this doesn\'t have to be the end.  The gods are willing to give you another chance'
    },
    {
      name: 'win game',
      'button text': ['Give it another go?', 'Can you do it more efficently?', 'Replay?', 'Try to beat your record?'],
      'button functions': [restart, restart, miniGame, restart],
      text:  'You have defeated the dragon, saved the village, and been granted the title of Dragonslayer Godking. Good job!'
    },
    {
      name: 'mini game',
      'button text': ['2', '8', '10', 'Go to Town Square'],
      'button functions': [pick2, pick8, pick10, goTown],
      text:  'You find a secret game. Pick a number above. If it is in the list of randomly selected numbers, you win!'
    },
    {
      name: 'inn',
      'button text': ['Eat a Meal', 'Soak in the Hot Spring', 'Attend Massage Session', 'Go to Town Square'],
      'button functions': [eatMeal, hotSpringSoak, massageSession, goTown],
      text:  'You enter the inn.  It offers many rejuvenating services. A simple meal will restore 20 health for 15 gold. Use of the hot springs will restore 50 health for 30 gold. The massage session will fill health to maximum for 75 gold.'
    }
]

// initialize buttons

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = goInn;
button4.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = 'none';
    button1.innerText = location['button text'][0];
    button2.innerText = location['button text'][1];
    button3.innerText = location['button text'][2];
    button4.innerText = location['button text'][3];
    button1.onclick = location['button functions'][0];
    button2.onclick = location['button functions'][1];
    button3.onclick = location['button functions'][2];
    button4.onclick = location['button functions'][3];
    text.innerText = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function heal(item) {
    if (gold >= item.cost && health < 300) {
    gold -= item.cost;
    health += item.health;
        if (health >= 300) {
            health = 300;
        }
    goldText.innerText = gold;
    healthText.innerText = health;
    } else if (gold >= item.cost && health >= 300) {
        text.innerText = 'You already have full health.';
    } else
        text.innerText = 'You are broke and cannot afford a  ' + item.name + ' .';
}

function buyPotion() {
    heal(restoratives[0]);
}

function eatMeal() {
    heal(restoratives[1]);
}

function hotSpringSoak() {
    heal(restoratives[2]);
}

function massageSession() {
    heal(restoratives[3]);
}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
        if (gold >= 30) {
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
            text.innerText = 'You now have a ' + newWeapon + '.';
            inventory.push(newWeapon);
            text.innerText += ' Your inventory now contains: ' + inventory;
        } else {
            text.innerText = 'You are broke and can\'t afford a weapon.';
        }
    } else {
        text.innerText = 'You already possess the strongest weapon in the village.';
        button2.innerText = "Sell weapon for 15 gold";
		button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15;
		goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
	} else {
    	text.innerText = "Don't sell your only weapon!";
  	}
}

function buyArmor() {
    if (armorList.length < armor.length) {
        if (gold >= 100) {
            gold -= 100;
            goldText.innerText = gold;
            let newArmor = armor[currentArmor];
            text.innerText = 'You now have a ' + newArmor.name + '.';
            armorList.push(newArmor);
            currentArmor++
            text.innerText += ' Your inventory now contains ' + armorList.length + ' pieces of armor.';
        } else {
            text.innerText = 'You are broke and can\'t afford any armor pieces.';
        }
    } else {
        text.innerText = 'You already possess the full armor set.'
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightWolf() {
    fighting = 1;
    goFight();
}

function fightVampire() {
    fighting = 2;
    goFight();
}

function fightDragon() {
    fighting = 3;
    goFight();
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks.";
    text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
    if(isMonsterHit()) {
        health -= damageToPlayer(monsters[fighting].level);
    } else {
        text.innerText += "Your attack failed. The monster took no damage."
    }
    monsterHealth -= (Math.floor((Math.sqrt(xp) * 1.25))) + weapons[currentWeapon].power;
	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth; 
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        fighting === 3 ? winGame() : defeatMonster(); // ternary simplified if/else
    }
    if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += ' Your ' + inventory.pop() + ' breaks.';
        currentWeapon--;
    }
}

function kamikaze() {
    lose();
}

function damageToPlayer(level) {
    let hit =  Math.floor(((Math.random() * level * 10)) - ((armorList.length * 5) + (xp / 20)));
    if (hit < 0) {
        hit = 0;
    } 
    return hit;
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
}

function lose() {
    update(locations[5]);
    document.body.style.backgroundColor = "firebrick";
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ['stick'];
    goldText.innerText = gold;
    healthText.innerText = health;
    xpText.innerText = xp;
    document.body.style.backgroundColor = "darkblue";
    goTown();
}

function winGame() {
    update(locations[6]);
}

function miniGame() {
    update(locations[7]);
}

function goInn() {
    update(locations[8]);
}

function pick2() {
    pick(2);
}

function pick8() {
    pick(8);
}

function pick10() {
    pick(10);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.ceil(Math.random() * 10))
    }
    text.innerText = 'You picked ' + guess + '. Here are the random numbers:\n';
    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + '\n';
    }
    if (numbers.indexOf(guess) !== -1) {
        text.innerText += 'Correct!! You win 20 gold!!';
        gold += 20;
        goldText. innerText = gold;
    } else {
        text.innerText += 'Wrong!! You lose 10 health!!';
        health -= 10;
        healthText. innerText = health
        if (health <= 0) {
            lose();
        }
    }
}