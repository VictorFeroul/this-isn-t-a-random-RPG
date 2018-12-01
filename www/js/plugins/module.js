//=============================================================================
// Gandalf.js
//=============================================================================

/*:
 * @plugindesc Gandalf.
 * @author Yoji Ojima
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc Gandalf
 * @author Yoji Ojima
 *
 * @help Gandalf
 */

(function () {


    BattleManager.endTurn = function () {
        if($gameVariables.value(1) == true){
            gandalfAction();
        }
        this._phase = 'turnEnd';
        this._preemptive = false;
        this._surprise = false;
        this.allBattleMembers().forEach(function (battler) {
            battler.onTurnEnd();
            this.refreshStatus();
            this._logWindow.displayAutoAffectedStatus(battler);
            this._logWindow.displayRegeneration(battler);
        }, this);
    };


    function gandalfAction() {
        var nbMembre = $gameParty.members().length;
        var membres = $gameParty.members();
        var half = false;
        var index_lowestPlayer = null;
        var lowestPlayer = null;
        var pourcentage_hp_lowest = null;
        for (var i = 0; i < nbMembre - 1; i++) {
            var hp = membres[i]._hp
            var max_hp = membres[i].mhp
            var temp_pourcentage = hp * 100 / max_hp;
            if ((index_lowestPlayer == null || temp_pourcentage < pourcentage_hp_lowest) && (hp > 0)) {
                index_lowestPlayer = i
                pourcentage_hp_lowest = temp_pourcentage
                lowestPlayer = $gameActors.actor($gameParty.members()[i].actorId());
            }
            if (hp < max_hp / 2) {
                half = true
            }
        }
        if (half) {
            gandalfHeal(lowestPlayer)
        } else {
            gandalfAttack(nbMembre)
        }
    }

    function gandalfHeal(lowestPlayer) {
        var heal = getRandomInt(600)
        lowestPlayer.gainHp(heal)
        displayMessage(false, heal, true, lowestPlayer)
    }

    function gandalfAttack(nb) {
        var rand_type_target = getRandomInt(5);
        if (rand_type_target == 0) {
            spellCast(false);
        } else {
            spellCast(true);
        }
    }

    function spellCast(enemy) {
        var dmg = -getRandomInt(250);
        var ind_Ami = parseInt(getRandomInt($gameParty.aliveMembers().length)+1);
        var ind_Ene = parseInt(getRandomInt($gameTroop.aliveMembers().length)+1);
        if (enemy) {
            var me = $gameTroop.members()[ind_Ene];
            var de = dmg;
            var KOe = true;
            Game_Interpreter.prototype.changeHp.call(this, me, de, KOe);
            displayMessage(true, dmg, false, ind_Ami)
        } else {
            var ma = $gameActors.actor(ind_Ami);
            var da = dmg;
            var KOa = true;
            Game_Interpreter.prototype.changeHp.call(this, ma, da, KOa);
            displayMessage(true, dmg, true, ind_Ami)
        }
    }


    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function displayMessage(type_action, hp, type_benef, id_benef) {
        $gameMessage.setBackground(.5)
        $gameMessage.setPositionType(0)
        var nom = "";
        if (type_action) {
            if (type_benef) {
                nom = $gameActors.actor(id_benef)._name;
                $gameMessage.add("Gandalf is a old fool,")
                $gameMessage.add("He inflicts " + hp + " damage")
                $gameMessage.add("to " + nom + " ...")
            } else {
                nom = $gameTroop.members()[id_benef]._name;
                $gameMessage.add("Gandalf helps you !")
                $gameMessage.add("he inflicts" + hp + " damage")
                $gameMessage.add("to the enemy!")
            }
        } else {
            $gameMessage.add("Gandalf throw a spell on you !")
            $gameMessage.add("you gain " + hp + " hp")
            $gameMessage.add(" to " + id_benef._name + " ...")
        }
    }


})
();


// var gandalf = {
//     "id": 5,
//     "team_member": "",
//     "balrog": function () {
//         $gameMessage.setFaceImage('Merlin', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);$gameParty.aliveMembers().length > 0
//         $gameMessage.add("Je vais devoir me séparer de vous ");
//         $gameMessage.add("pendant un moment.");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Comment allons nous faire sans vous ?");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Ballec du clodo");
//         $gameMessage.add("J'ai envie de me barrer de ce trou.");
//         $gameMessage.add("On continue !!");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Mais ... Gandalf !!");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Ferme la junkie.");
//     },
//     "retour_balrog": function () {
//         $gameScreen.startFlash([255, 255, 255, 100], 120);
//         $gameScreen.changeWeather("snow", 9, 360);
//
//         $gameMessage.setFaceImage('GandalfBlanc', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Mes amis ! Je suis de retour");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("T'es qui ?");
//
//         $gameMessage.setFaceImage('GandalfBlanc', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Bah c'est moi !!");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Commence pas à me les briser ...");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("C'est Gandalf !!");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Aaaaaaaaaah");
//         $gameMessage.add("Rentre dans le rang.");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Mais !..");
//
//         $gameScreen.changeWeather();
//
//         $gameParty.addActor(5);
//     },
//     "promenade": function () {
//         $gameMessage.setFaceImage('Merlin', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Bouge toi.");
//
//         $gameMessage.setFaceImage('Mario', 0);
//         $gameMessage.setBackground(1);
//         $gameMessage.setPositionType(1);
//         $gameMessage.add("Ok");
//
//         $gameScreen.startFlash([255, 255, 255, 100], 120);
//
//         $gameParty.removeActor(gandalf.id);
//     },
//     "combat": function () {
//     }
// }

