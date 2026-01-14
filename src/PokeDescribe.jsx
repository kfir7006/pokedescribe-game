/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { database, ref, set, get, onValue, remove } from './firebase';

// All 1025 Pokémon organized by difficulty
// Easy: Gen 1 starters, mascots, legendaries, very popular Pokémon
// Medium: Popular but less iconic Pokémon from all generations
// Hard: Obscure, forgettable, or less recognizable Pokémon

const POKEMON_POOLS = {
  easy: [
    // Gen 1 - Iconic
    { name: 'Bulbasaur', sprite: '1' },
    { name: 'Ivysaur', sprite: '2' },
    { name: 'Venusaur', sprite: '3' },
    { name: 'Charmander', sprite: '4' },
    { name: 'Charmeleon', sprite: '5' },
    { name: 'Charizard', sprite: '6' },
    { name: 'Squirtle', sprite: '7' },
    { name: 'Wartortle', sprite: '8' },
    { name: 'Blastoise', sprite: '9' },
    { name: 'Caterpie', sprite: '10' },
    { name: 'Metapod', sprite: '11' },
    { name: 'Butterfree', sprite: '12' },
    { name: 'Weedle', sprite: '13' },
    { name: 'Kakuna', sprite: '14' },
    { name: 'Beedrill', sprite: '15' },
    { name: 'Pidgey', sprite: '16' },
    { name: 'Pidgeotto', sprite: '17' },
    { name: 'Pidgeot', sprite: '18' },
    { name: 'Rattata', sprite: '19' },
    { name: 'Raticate', sprite: '20' },
    { name: 'Spearow', sprite: '21' },
    { name: 'Fearow', sprite: '22' },
    { name: 'Ekans', sprite: '23' },
    { name: 'Arbok', sprite: '24' },
    { name: 'Pikachu', sprite: '25' },
    { name: 'Raichu', sprite: '26' },
    { name: 'Sandshrew', sprite: '27' },
    { name: 'Sandslash', sprite: '28' },
    { name: 'Nidoran♀', sprite: '29' },
    { name: 'Nidorina', sprite: '30' },
    { name: 'Nidoqueen', sprite: '31' },
    { name: 'Nidoran♂', sprite: '32' },
    { name: 'Nidorino', sprite: '33' },
    { name: 'Nidoking', sprite: '34' },
    { name: 'Clefairy', sprite: '35' },
    { name: 'Clefable', sprite: '36' },
    { name: 'Vulpix', sprite: '37' },
    { name: 'Ninetales', sprite: '38' },
    { name: 'Jigglypuff', sprite: '39' },
    { name: 'Wigglytuff', sprite: '40' },
    { name: 'Zubat', sprite: '41' },
    { name: 'Golbat', sprite: '42' },
    { name: 'Oddish', sprite: '43' },
    { name: 'Gloom', sprite: '44' },
    { name: 'Vileplume', sprite: '45' },
    { name: 'Paras', sprite: '46' },
    { name: 'Parasect', sprite: '47' },
    { name: 'Venonat', sprite: '48' },
    { name: 'Venomoth', sprite: '49' },
    { name: 'Diglett', sprite: '50' },
    { name: 'Dugtrio', sprite: '51' },
    { name: 'Meowth', sprite: '52' },
    { name: 'Persian', sprite: '53' },
    { name: 'Psyduck', sprite: '54' },
    { name: 'Golduck', sprite: '55' },
    { name: 'Mankey', sprite: '56' },
    { name: 'Primeape', sprite: '57' },
    { name: 'Growlithe', sprite: '58' },
    { name: 'Arcanine', sprite: '59' },
    { name: 'Poliwag', sprite: '60' },
    { name: 'Poliwhirl', sprite: '61' },
    { name: 'Poliwrath', sprite: '62' },
    { name: 'Abra', sprite: '63' },
    { name: 'Kadabra', sprite: '64' },
    { name: 'Alakazam', sprite: '65' },
    { name: 'Machop', sprite: '66' },
    { name: 'Machoke', sprite: '67' },
    { name: 'Machamp', sprite: '68' },
    { name: 'Bellsprout', sprite: '69' },
    { name: 'Weepinbell', sprite: '70' },
    { name: 'Victreebel', sprite: '71' },
    { name: 'Tentacool', sprite: '72' },
    { name: 'Tentacruel', sprite: '73' },
    { name: 'Geodude', sprite: '74' },
    { name: 'Graveler', sprite: '75' },
    { name: 'Golem', sprite: '76' },
    { name: 'Ponyta', sprite: '77' },
    { name: 'Rapidash', sprite: '78' },
    { name: 'Slowpoke', sprite: '79' },
    { name: 'Slowbro', sprite: '80' },
    { name: 'Magnemite', sprite: '81' },
    { name: 'Magneton', sprite: '82' },
    { name: 'Doduo', sprite: '84' },
    { name: 'Dodrio', sprite: '85' },
    { name: 'Seel', sprite: '86' },
    { name: 'Dewgong', sprite: '87' },
    { name: 'Grimer', sprite: '88' },
    { name: 'Muk', sprite: '89' },
    { name: 'Shellder', sprite: '90' },
    { name: 'Cloyster', sprite: '91' },
    { name: 'Gastly', sprite: '92' },
    { name: 'Haunter', sprite: '93' },
    { name: 'Gengar', sprite: '94' },
    { name: 'Onix', sprite: '95' },
    { name: 'Drowzee', sprite: '96' },
    { name: 'Hypno', sprite: '97' },
    { name: 'Krabby', sprite: '98' },
    { name: 'Kingler', sprite: '99' },
    { name: 'Voltorb', sprite: '100' },
    { name: 'Electrode', sprite: '101' },
    { name: 'Exeggcute', sprite: '102' },
    { name: 'Exeggutor', sprite: '103' },
    { name: 'Cubone', sprite: '104' },
    { name: 'Marowak', sprite: '105' },
    { name: 'Hitmonlee', sprite: '106' },
    { name: 'Hitmonchan', sprite: '107' },
    { name: 'Lickitung', sprite: '108' },
    { name: 'Koffing', sprite: '109' },
    { name: 'Weezing', sprite: '110' },
    { name: 'Rhyhorn', sprite: '111' },
    { name: 'Rhydon', sprite: '112' },
    { name: 'Chansey', sprite: '113' },
    { name: 'Tangela', sprite: '114' },
    { name: 'Kangaskhan', sprite: '115' },
    { name: 'Horsea', sprite: '116' },
    { name: 'Seadra', sprite: '117' },
    { name: 'Goldeen', sprite: '118' },
    { name: 'Seaking', sprite: '119' },
    { name: 'Staryu', sprite: '120' },
    { name: 'Starmie', sprite: '121' },
    { name: 'Mr. Mime', sprite: '122' },
    { name: 'Scyther', sprite: '123' },
    { name: 'Jynx', sprite: '124' },
    { name: 'Electabuzz', sprite: '125' },
    { name: 'Magmar', sprite: '126' },
    { name: 'Pinsir', sprite: '127' },
    { name: 'Tauros', sprite: '128' },
    { name: 'Magikarp', sprite: '129' },
    { name: 'Gyarados', sprite: '130' },
    { name: 'Lapras', sprite: '131' },
    { name: 'Ditto', sprite: '132' },
    { name: 'Eevee', sprite: '133' },
    { name: 'Vaporeon', sprite: '134' },
    { name: 'Jolteon', sprite: '135' },
    { name: 'Flareon', sprite: '136' },
    { name: 'Porygon', sprite: '137' },
    { name: 'Omanyte', sprite: '138' },
    { name: 'Omastar', sprite: '139' },
    { name: 'Kabuto', sprite: '140' },
    { name: 'Kabutops', sprite: '141' },
    { name: 'Aerodactyl', sprite: '142' },
    { name: 'Snorlax', sprite: '143' },
    { name: 'Articuno', sprite: '144' },
    { name: 'Zapdos', sprite: '145' },
    { name: 'Moltres', sprite: '146' },
    { name: 'Dratini', sprite: '147' },
    { name: 'Dragonair', sprite: '148' },
    { name: 'Dragonite', sprite: '149' },
    { name: 'Mewtwo', sprite: '150' },
    { name: 'Mew', sprite: '151' },
    // Gen 2 - Popular
    { name: 'Chikorita', sprite: '152' },
    { name: 'Bayleef', sprite: '153' },
    { name: 'Meganium', sprite: '154' },
    { name: 'Cyndaquil', sprite: '155' },
    { name: 'Quilava', sprite: '156' },
    { name: 'Typhlosion', sprite: '157' },
    { name: 'Totodile', sprite: '158' },
    { name: 'Croconaw', sprite: '159' },
    { name: 'Feraligatr', sprite: '160' },
    { name: 'Pichu', sprite: '172' },
    { name: 'Cleffa', sprite: '173' },
    { name: 'Igglybuff', sprite: '174' },
    { name: 'Togepi', sprite: '175' },
    { name: 'Togetic', sprite: '176' },
    { name: 'Mareep', sprite: '179' },
    { name: 'Flaaffy', sprite: '180' },
    { name: 'Ampharos', sprite: '181' },
    { name: 'Marill', sprite: '183' },
    { name: 'Azumarill', sprite: '184' },
    { name: 'Espeon', sprite: '196' },
    { name: 'Umbreon', sprite: '197' },
    { name: 'Wobbuffet', sprite: '202' },
    { name: 'Heracross', sprite: '214' },
    { name: 'Scizor', sprite: '212' },
    { name: 'Tyranitar', sprite: '248' },
    { name: 'Lugia', sprite: '249' },
    { name: 'Ho-Oh', sprite: '250' },
    { name: 'Celebi', sprite: '251' },
  ],
  
  medium: [
    // Rest of Gen 2
    { name: 'Sentret', sprite: '161' },
    { name: 'Furret', sprite: '162' },
    { name: 'Hoothoot', sprite: '163' },
    { name: 'Noctowl', sprite: '164' },
    { name: 'Ledyba', sprite: '165' },
    { name: 'Ledian', sprite: '166' },
    { name: 'Spinarak', sprite: '167' },
    { name: 'Ariados', sprite: '168' },
    { name: 'Crobat', sprite: '169' },
    { name: 'Chinchou', sprite: '170' },
    { name: 'Lanturn', sprite: '171' },
    { name: 'Natu', sprite: '177' },
    { name: 'Xatu', sprite: '178' },
    { name: 'Bellossom', sprite: '182' },
    { name: 'Sudowoodo', sprite: '185' },
    { name: 'Politoed', sprite: '186' },
    { name: 'Hoppip', sprite: '187' },
    { name: 'Skiploom', sprite: '188' },
    { name: 'Jumpluff', sprite: '189' },
    { name: 'Aipom', sprite: '190' },
    { name: 'Sunkern', sprite: '191' },
    { name: 'Sunflora', sprite: '192' },
    { name: 'Yanma', sprite: '193' },
    { name: 'Wooper', sprite: '194' },
    { name: 'Quagsire', sprite: '195' },
    { name: 'Murkrow', sprite: '198' },
    { name: 'Slowking', sprite: '199' },
    { name: 'Misdreavus', sprite: '200' },
    { name: 'Unown', sprite: '201' },
    { name: 'Girafarig', sprite: '203' },
    { name: 'Pineco', sprite: '204' },
    { name: 'Forretress', sprite: '205' },
    { name: 'Dunsparce', sprite: '206' },
    { name: 'Gligar', sprite: '207' },
    { name: 'Steelix', sprite: '208' },
    { name: 'Snubbull', sprite: '209' },
    { name: 'Granbull', sprite: '210' },
    { name: 'Qwilfish', sprite: '211' },
    { name: 'Shuckle', sprite: '213' },
    { name: 'Sneasel', sprite: '215' },
    { name: 'Teddiursa', sprite: '216' },
    { name: 'Ursaring', sprite: '217' },
    { name: 'Slugma', sprite: '218' },
    { name: 'Magcargo', sprite: '219' },
    { name: 'Swinub', sprite: '220' },
    { name: 'Piloswine', sprite: '221' },
    { name: 'Corsola', sprite: '222' },
    { name: 'Remoraid', sprite: '223' },
    { name: 'Octillery', sprite: '224' },
    { name: 'Delibird', sprite: '225' },
    { name: 'Mantine', sprite: '226' },
    { name: 'Skarmory', sprite: '227' },
    { name: 'Houndour', sprite: '228' },
    { name: 'Houndoom', sprite: '229' },
    { name: 'Kingdra', sprite: '230' },
    { name: 'Phanpy', sprite: '231' },
    { name: 'Donphan', sprite: '232' },
    { name: 'Porygon2', sprite: '233' },
    { name: 'Stantler', sprite: '234' },
    { name: 'Smeargle', sprite: '235' },
    { name: 'Tyrogue', sprite: '236' },
    { name: 'Hitmontop', sprite: '237' },
    { name: 'Smoochum', sprite: '238' },
    { name: 'Elekid', sprite: '239' },
    { name: 'Magby', sprite: '240' },
    { name: 'Miltank', sprite: '241' },
    { name: 'Blissey', sprite: '242' },
    { name: 'Raikou', sprite: '243' },
    { name: 'Entei', sprite: '244' },
    { name: 'Suicune', sprite: '245' },
    { name: 'Larvitar', sprite: '246' },
    { name: 'Pupitar', sprite: '247' },
    // Gen 3 - Popular
    { name: 'Treecko', sprite: '252' },
    { name: 'Grovyle', sprite: '253' },
    { name: 'Sceptile', sprite: '254' },
    { name: 'Torchic', sprite: '255' },
    { name: 'Combusken', sprite: '256' },
    { name: 'Blaziken', sprite: '257' },
    { name: 'Mudkip', sprite: '258' },
    { name: 'Marshtomp', sprite: '259' },
    { name: 'Swampert', sprite: '260' },
    { name: 'Poochyena', sprite: '261' },
    { name: 'Mightyena', sprite: '262' },
    { name: 'Zigzagoon', sprite: '263' },
    { name: 'Linoone', sprite: '264' },
    { name: 'Wurmple', sprite: '265' },
    { name: 'Silcoon', sprite: '266' },
    { name: 'Beautifly', sprite: '267' },
    { name: 'Cascoon', sprite: '268' },
    { name: 'Dustox', sprite: '269' },
    { name: 'Lotad', sprite: '270' },
    { name: 'Lombre', sprite: '271' },
    { name: 'Ludicolo', sprite: '272' },
    { name: 'Seedot', sprite: '273' },
    { name: 'Nuzleaf', sprite: '274' },
    { name: 'Shiftry', sprite: '275' },
    { name: 'Taillow', sprite: '276' },
    { name: 'Swellow', sprite: '277' },
    { name: 'Wingull', sprite: '278' },
    { name: 'Pelipper', sprite: '279' },
    { name: 'Ralts', sprite: '280' },
    { name: 'Kirlia', sprite: '281' },
    { name: 'Gardevoir', sprite: '282' },
    { name: 'Surskit', sprite: '283' },
    { name: 'Masquerain', sprite: '284' },
    { name: 'Shroomish', sprite: '285' },
    { name: 'Breloom', sprite: '286' },
    { name: 'Slakoth', sprite: '287' },
    { name: 'Vigoroth', sprite: '288' },
    { name: 'Slaking', sprite: '289' },
    { name: 'Nincada', sprite: '290' },
    { name: 'Ninjask', sprite: '291' },
    { name: 'Shedinja', sprite: '292' },
    { name: 'Whismur', sprite: '293' },
    { name: 'Loudred', sprite: '294' },
    { name: 'Exploud', sprite: '295' },
    { name: 'Makuhita', sprite: '296' },
    { name: 'Hariyama', sprite: '297' },
    { name: 'Azurill', sprite: '298' },
    { name: 'Nosepass', sprite: '299' },
    { name: 'Skitty', sprite: '300' },
    { name: 'Delcatty', sprite: '301' },
    { name: 'Sableye', sprite: '302' },
    { name: 'Mawile', sprite: '303' },
    { name: 'Aron', sprite: '304' },
    { name: 'Lairon', sprite: '305' },
    { name: 'Aggron', sprite: '306' },
    { name: 'Meditite', sprite: '307' },
    { name: 'Medicham', sprite: '308' },
    { name: 'Electrike', sprite: '309' },
    { name: 'Manectric', sprite: '310' },
    { name: 'Plusle', sprite: '311' },
    { name: 'Minun', sprite: '312' },
    { name: 'Volbeat', sprite: '313' },
    { name: 'Illumise', sprite: '314' },
    { name: 'Roselia', sprite: '315' },
    { name: 'Gulpin', sprite: '316' },
    { name: 'Swalot', sprite: '317' },
    { name: 'Carvanha', sprite: '318' },
    { name: 'Sharpedo', sprite: '319' },
    { name: 'Wailmer', sprite: '320' },
    { name: 'Wailord', sprite: '321' },
    { name: 'Numel', sprite: '322' },
    { name: 'Camerupt', sprite: '323' },
    { name: 'Torkoal', sprite: '324' },
    { name: 'Spoink', sprite: '325' },
    { name: 'Grumpig', sprite: '326' },
    { name: 'Spinda', sprite: '327' },
    { name: 'Trapinch', sprite: '328' },
    { name: 'Vibrava', sprite: '329' },
    { name: 'Flygon', sprite: '330' },
    { name: 'Cacnea', sprite: '331' },
    { name: 'Cacturne', sprite: '332' },
    { name: 'Swablu', sprite: '333' },
    { name: 'Altaria', sprite: '334' },
    { name: 'Zangoose', sprite: '335' },
    { name: 'Seviper', sprite: '336' },
    { name: 'Lunatone', sprite: '337' },
    { name: 'Solrock', sprite: '338' },
    { name: 'Barboach', sprite: '339' },
    { name: 'Whiscash', sprite: '340' },
    { name: 'Corphish', sprite: '341' },
    { name: 'Crawdaunt', sprite: '342' },
    { name: 'Baltoy', sprite: '343' },
    { name: 'Claydol', sprite: '344' },
    { name: 'Lileep', sprite: '345' },
    { name: 'Cradily', sprite: '346' },
    { name: 'Anorith', sprite: '347' },
    { name: 'Armaldo', sprite: '348' },
    { name: 'Feebas', sprite: '349' },
    { name: 'Milotic', sprite: '350' },
    { name: 'Castform', sprite: '351' },
    { name: 'Kecleon', sprite: '352' },
    { name: 'Shuppet', sprite: '353' },
    { name: 'Banette', sprite: '354' },
    { name: 'Duskull', sprite: '355' },
    { name: 'Dusclops', sprite: '356' },
    { name: 'Tropius', sprite: '357' },
    { name: 'Chimecho', sprite: '358' },
    { name: 'Absol', sprite: '359' },
    { name: 'Wynaut', sprite: '360' },
    { name: 'Snorunt', sprite: '361' },
    { name: 'Glalie', sprite: '362' },
    { name: 'Spheal', sprite: '363' },
    { name: 'Sealeo', sprite: '364' },
    { name: 'Walrein', sprite: '365' },
    { name: 'Clamperl', sprite: '366' },
    { name: 'Huntail', sprite: '367' },
    { name: 'Gorebyss', sprite: '368' },
    { name: 'Relicanth', sprite: '369' },
    { name: 'Luvdisc', sprite: '370' },
    { name: 'Bagon', sprite: '371' },
    { name: 'Shelgon', sprite: '372' },
    { name: 'Salamence', sprite: '373' },
    { name: 'Beldum', sprite: '374' },
    { name: 'Metang', sprite: '375' },
    { name: 'Metagross', sprite: '376' },
    { name: 'Regirock', sprite: '377' },
    { name: 'Regice', sprite: '378' },
    { name: 'Registeel', sprite: '379' },
    { name: 'Latias', sprite: '380' },
    { name: 'Latios', sprite: '381' },
    { name: 'Kyogre', sprite: '382' },
    { name: 'Groudon', sprite: '383' },
    { name: 'Rayquaza', sprite: '384' },
    { name: 'Jirachi', sprite: '385' },
    { name: 'Deoxys', sprite: '386' },
    // Gen 4 - Popular
    { name: 'Turtwig', sprite: '387' },
    { name: 'Grotle', sprite: '388' },
    { name: 'Torterra', sprite: '389' },
    { name: 'Chimchar', sprite: '390' },
    { name: 'Monferno', sprite: '391' },
    { name: 'Infernape', sprite: '392' },
    { name: 'Piplup', sprite: '393' },
    { name: 'Prinplup', sprite: '394' },
    { name: 'Empoleon', sprite: '395' },
    { name: 'Starly', sprite: '396' },
    { name: 'Staravia', sprite: '397' },
    { name: 'Staraptor', sprite: '398' },
    { name: 'Bidoof', sprite: '399' },
    { name: 'Bibarel', sprite: '400' },
    { name: 'Kricketot', sprite: '401' },
    { name: 'Kricketune', sprite: '402' },
    { name: 'Shinx', sprite: '403' },
    { name: 'Luxio', sprite: '404' },
    { name: 'Luxray', sprite: '405' },
    { name: 'Budew', sprite: '406' },
    { name: 'Roserade', sprite: '407' },
    { name: 'Cranidos', sprite: '408' },
    { name: 'Rampardos', sprite: '409' },
    { name: 'Shieldon', sprite: '410' },
    { name: 'Bastiodon', sprite: '411' },
    { name: 'Burmy', sprite: '412' },
    { name: 'Wormadam', sprite: '413' },
    { name: 'Mothim', sprite: '414' },
    { name: 'Combee', sprite: '415' },
    { name: 'Vespiquen', sprite: '416' },
    { name: 'Pachirisu', sprite: '417' },
    { name: 'Buizel', sprite: '418' },
    { name: 'Floatzel', sprite: '419' },
    { name: 'Cherubi', sprite: '420' },
    { name: 'Cherrim', sprite: '421' },
    { name: 'Shellos', sprite: '422' },
    { name: 'Gastrodon', sprite: '423' },
    { name: 'Ambipom', sprite: '424' },
    { name: 'Drifloon', sprite: '425' },
    { name: 'Drifblim', sprite: '426' },
    { name: 'Buneary', sprite: '427' },
    { name: 'Lopunny', sprite: '428' },
    { name: 'Mismagius', sprite: '429' },
    { name: 'Honchkrow', sprite: '430' },
    { name: 'Glameow', sprite: '431' },
    { name: 'Purugly', sprite: '432' },
    { name: 'Chingling', sprite: '433' },
    { name: 'Stunky', sprite: '434' },
    { name: 'Skuntank', sprite: '435' },
    { name: 'Bronzor', sprite: '436' },
    { name: 'Bronzong', sprite: '437' },
    { name: 'Bonsly', sprite: '438' },
    { name: 'Mime Jr.', sprite: '439' },
    { name: 'Happiny', sprite: '440' },
    { name: 'Chatot', sprite: '441' },
    { name: 'Spiritomb', sprite: '442' },
    { name: 'Gible', sprite: '443' },
    { name: 'Gabite', sprite: '444' },
    { name: 'Garchomp', sprite: '445' },
    { name: 'Munchlax', sprite: '446' },
    { name: 'Riolu', sprite: '447' },
    { name: 'Lucario', sprite: '448' },
    { name: 'Hippopotas', sprite: '449' },
    { name: 'Hippowdon', sprite: '450' },
    { name: 'Skorupi', sprite: '451' },
    { name: 'Drapion', sprite: '452' },
    { name: 'Croagunk', sprite: '453' },
    { name: 'Toxicroak', sprite: '454' },
    { name: 'Carnivine', sprite: '455' },
    { name: 'Finneon', sprite: '456' },
    { name: 'Lumineon', sprite: '457' },
    { name: 'Mantyke', sprite: '458' },
    { name: 'Snover', sprite: '459' },
    { name: 'Abomasnow', sprite: '460' },
    { name: 'Weavile', sprite: '461' },
    { name: 'Magnezone', sprite: '462' },
    { name: 'Lickilicky', sprite: '463' },
    { name: 'Rhyperior', sprite: '464' },
    { name: 'Tangrowth', sprite: '465' },
    { name: 'Electivire', sprite: '466' },
    { name: 'Magmortar', sprite: '467' },
    { name: 'Togekiss', sprite: '468' },
    { name: 'Yanmega', sprite: '469' },
    { name: 'Leafeon', sprite: '470' },
    { name: 'Glaceon', sprite: '471' },
    { name: 'Gliscor', sprite: '472' },
    { name: 'Mamoswine', sprite: '473' },
    { name: 'Porygon-Z', sprite: '474' },
    { name: 'Gallade', sprite: '475' },
    { name: 'Probopass', sprite: '476' },
    { name: 'Dusknoir', sprite: '477' },
    { name: 'Froslass', sprite: '478' },
    { name: 'Rotom', sprite: '479' },
    { name: 'Uxie', sprite: '480' },
    { name: 'Mesprit', sprite: '481' },
    { name: 'Azelf', sprite: '482' },
    { name: 'Dialga', sprite: '483' },
    { name: 'Palkia', sprite: '484' },
    { name: 'Heatran', sprite: '485' },
    { name: 'Regigigas', sprite: '486' },
    { name: 'Giratina', sprite: '487' },
    { name: 'Cresselia', sprite: '488' },
    { name: 'Phione', sprite: '489' },
    { name: 'Manaphy', sprite: '490' },
    { name: 'Darkrai', sprite: '491' },
    { name: 'Shaymin', sprite: '492' },
    { name: 'Arceus', sprite: '493' },
  ],
  
  hard: [
    // Gen 5 onwards - Most Pokémon here
    { name: 'Victini', sprite: '494' },
    { name: 'Snivy', sprite: '495' },
    { name: 'Servine', sprite: '496' },
    { name: 'Serperior', sprite: '497' },
    { name: 'Tepig', sprite: '498' },
    { name: 'Pignite', sprite: '499' },
    { name: 'Emboar', sprite: '500' },
    { name: 'Oshawott', sprite: '501' },
    { name: 'Dewott', sprite: '502' },
    { name: 'Samurott', sprite: '503' },
    { name: 'Patrat', sprite: '504' },
    { name: 'Watchog', sprite: '505' },
    { name: 'Lillipup', sprite: '506' },
    { name: 'Herdier', sprite: '507' },
    { name: 'Stoutland', sprite: '508' },
    { name: 'Purrloin', sprite: '509' },
    { name: 'Liepard', sprite: '510' },
    { name: 'Pansage', sprite: '511' },
    { name: 'Simisage', sprite: '512' },
    { name: 'Pansear', sprite: '513' },
    { name: 'Simisear', sprite: '514' },
    { name: 'Panpour', sprite: '515' },
    { name: 'Simipour', sprite: '516' },
    { name: 'Munna', sprite: '517' },
    { name: 'Musharna', sprite: '518' },
    { name: 'Pidove', sprite: '519' },
    { name: 'Tranquill', sprite: '520' },
    { name: 'Unfezant', sprite: '521' },
    { name: 'Blitzle', sprite: '522' },
    { name: 'Zebstrika', sprite: '523' },
    { name: 'Roggenrola', sprite: '524' },
    { name: 'Boldore', sprite: '525' },
    { name: 'Gigalith', sprite: '526' },
    { name: 'Woobat', sprite: '527' },
    { name: 'Swoobat', sprite: '528' },
    { name: 'Drilbur', sprite: '529' },
    { name: 'Excadrill', sprite: '530' },
    { name: 'Audino', sprite: '531' },
    { name: 'Timburr', sprite: '532' },
    { name: 'Gurdurr', sprite: '533' },
    { name: 'Conkeldurr', sprite: '534' },
    { name: 'Tympole', sprite: '535' },
    { name: 'Palpitoad', sprite: '536' },
    { name: 'Seismitoad', sprite: '537' },
    { name: 'Throh', sprite: '538' },
    { name: 'Sawk', sprite: '539' },
    { name: 'Sewaddle', sprite: '540' },
    { name: 'Swadloon', sprite: '541' },
    { name: 'Leavanny', sprite: '542' },
    { name: 'Venipede', sprite: '543' },
    { name: 'Whirlipede', sprite: '544' },
    { name: 'Scolipede', sprite: '545' },
    { name: 'Cottonee', sprite: '546' },
    { name: 'Whimsicott', sprite: '547' },
    { name: 'Petilil', sprite: '548' },
    { name: 'Lilligant', sprite: '549' },
    { name: 'Basculin', sprite: '550' },
    { name: 'Sandile', sprite: '551' },
    { name: 'Krokorok', sprite: '552' },
    { name: 'Krookodile', sprite: '553' },
    { name: 'Darumaka', sprite: '554' },
    { name: 'Darmanitan', sprite: '555' },
    { name: 'Maractus', sprite: '556' },
    { name: 'Dwebble', sprite: '557' },
    { name: 'Crustle', sprite: '558' },
    { name: 'Scraggy', sprite: '559' },
    { name: 'Scrafty', sprite: '560' },
    { name: 'Sigilyph', sprite: '561' },
    { name: 'Yamask', sprite: '562' },
    { name: 'Cofagrigus', sprite: '563' },
    { name: 'Tirtouga', sprite: '564' },
    { name: 'Carracosta', sprite: '565' },
    { name: 'Archen', sprite: '566' },
    { name: 'Archeops', sprite: '567' },
    { name: 'Trubbish', sprite: '568' },
    { name: 'Garbodor', sprite: '569' },
    { name: 'Zorua', sprite: '570' },
    { name: 'Zoroark', sprite: '571' },
    { name: 'Minccino', sprite: '572' },
    { name: 'Cinccino', sprite: '573' },
    { name: 'Gothita', sprite: '574' },
    { name: 'Gothorita', sprite: '575' },
    { name: 'Gothitelle', sprite: '576' },
    { name: 'Solosis', sprite: '577' },
    { name: 'Duosion', sprite: '578' },
    { name: 'Reuniclus', sprite: '579' },
    { name: 'Ducklett', sprite: '580' },
    { name: 'Swanna', sprite: '581' },
    { name: 'Vanillite', sprite: '582' },
    { name: 'Vanillish', sprite: '583' },
    { name: 'Vanilluxe', sprite: '584' },
    { name: 'Deerling', sprite: '585' },
    { name: 'Sawsbuck', sprite: '586' },
    { name: 'Emolga', sprite: '587' },
    { name: 'Karrablast', sprite: '588' },
    { name: 'Escavalier', sprite: '589' },
    { name: 'Foongus', sprite: '590' },
    { name: 'Amoonguss', sprite: '591' },
    { name: 'Frillish', sprite: '592' },
    { name: 'Jellicent', sprite: '593' },
    { name: 'Alomomola', sprite: '594' },
    { name: 'Joltik', sprite: '595' },
    { name: 'Galvantula', sprite: '596' },
    { name: 'Ferroseed', sprite: '597' },
    { name: 'Ferrothorn', sprite: '598' },
    { name: 'Klink', sprite: '599' },
    { name: 'Klang', sprite: '600' },
    { name: 'Klinklang', sprite: '601' },
    { name: 'Tynamo', sprite: '602' },
    { name: 'Eelektrik', sprite: '603' },
    { name: 'Eelektross', sprite: '604' },
    { name: 'Elgyem', sprite: '605' },
    { name: 'Beheeyem', sprite: '606' },
    { name: 'Litwick', sprite: '607' },
    { name: 'Lampent', sprite: '608' },
    { name: 'Chandelure', sprite: '609' },
    { name: 'Axew', sprite: '610' },
    { name: 'Fraxure', sprite: '611' },
    { name: 'Haxorus', sprite: '612' },
    { name: 'Cubchoo', sprite: '613' },
    { name: 'Beartic', sprite: '614' },
    { name: 'Cryogonal', sprite: '615' },
    { name: 'Shelmet', sprite: '616' },
    { name: 'Accelgor', sprite: '617' },
    { name: 'Stunfisk', sprite: '618' },
    { name: 'Mienfoo', sprite: '619' },
    { name: 'Mienshao', sprite: '620' },
    { name: 'Druddigon', sprite: '621' },
    { name: 'Golett', sprite: '622' },
    { name: 'Golurk', sprite: '623' },
    { name: 'Pawniard', sprite: '624' },
    { name: 'Bisharp', sprite: '625' },
    { name: 'Bouffalant', sprite: '626' },
    { name: 'Rufflet', sprite: '627' },
    { name: 'Braviary', sprite: '628' },
    { name: 'Vullaby', sprite: '629' },
    { name: 'Mandibuzz', sprite: '630' },
    { name: 'Heatmor', sprite: '631' },
    { name: 'Durant', sprite: '632' },
    { name: 'Deino', sprite: '633' },
    { name: 'Zweilous', sprite: '634' },
    { name: 'Hydreigon', sprite: '635' },
    { name: 'Larvesta', sprite: '636' },
    { name: 'Volcarona', sprite: '637' },
    { name: 'Cobalion', sprite: '638' },
    { name: 'Terrakion', sprite: '639' },
    { name: 'Virizion', sprite: '640' },
    { name: 'Tornadus', sprite: '641' },
    { name: 'Thundurus', sprite: '642' },
    { name: 'Reshiram', sprite: '643' },
    { name: 'Zekrom', sprite: '644' },
    { name: 'Landorus', sprite: '645' },
    { name: 'Kyurem', sprite: '646' },
    { name: 'Keldeo', sprite: '647' },
    { name: 'Meloetta', sprite: '648' },
    { name: 'Genesect', sprite: '649' },
    // Gen 6
    { name: 'Chespin', sprite: '650' },
    { name: 'Quilladin', sprite: '651' },
    { name: 'Chesnaught', sprite: '652' },
    { name: 'Fennekin', sprite: '653' },
    { name: 'Braixen', sprite: '654' },
    { name: 'Delphox', sprite: '655' },
    { name: 'Froakie', sprite: '656' },
    { name: 'Frogadier', sprite: '657' },
    { name: 'Greninja', sprite: '658' },
    { name: 'Bunnelby', sprite: '659' },
    { name: 'Diggersby', sprite: '660' },
    { name: 'Fletchling', sprite: '661' },
    { name: 'Fletchinder', sprite: '662' },
    { name: 'Talonflame', sprite: '663' },
    { name: 'Scatterbug', sprite: '664' },
    { name: 'Spewpa', sprite: '665' },
    { name: 'Vivillon', sprite: '666' },
    { name: 'Litleo', sprite: '667' },
    { name: 'Pyroar', sprite: '668' },
    { name: 'Flabébé', sprite: '669' },
    { name: 'Floette', sprite: '670' },
    { name: 'Florges', sprite: '671' },
    { name: 'Skiddo', sprite: '672' },
    { name: 'Gogoat', sprite: '673' },
    { name: 'Pancham', sprite: '674' },
    { name: 'Pangoro', sprite: '675' },
    { name: 'Furfrou', sprite: '676' },
    { name: 'Espurr', sprite: '677' },
    { name: 'Meowstic', sprite: '678' },
    { name: 'Honedge', sprite: '679' },
    { name: 'Doublade', sprite: '680' },
    { name: 'Aegislash', sprite: '681' },
    { name: 'Spritzee', sprite: '682' },
    { name: 'Aromatisse', sprite: '683' },
    { name: 'Swirlix', sprite: '684' },
    { name: 'Slurpuff', sprite: '685' },
    { name: 'Inkay', sprite: '686' },
    { name: 'Malamar', sprite: '687' },
    { name: 'Binacle', sprite: '688' },
    { name: 'Barbaracle', sprite: '689' },
    { name: 'Skrelp', sprite: '690' },
    { name: 'Dragalge', sprite: '691' },
    { name: 'Clauncher', sprite: '692' },
    { name: 'Clawitzer', sprite: '693' },
    { name: 'Helioptile', sprite: '694' },
    { name: 'Heliolisk', sprite: '695' },
    { name: 'Tyrunt', sprite: '696' },
    { name: 'Tyrantrum', sprite: '697' },
    { name: 'Amaura', sprite: '698' },
    { name: 'Aurorus', sprite: '699' },
    { name: 'Sylveon', sprite: '700' },
    { name: 'Hawlucha', sprite: '701' },
    { name: 'Dedenne', sprite: '702' },
    { name: 'Carbink', sprite: '703' },
    { name: 'Goomy', sprite: '704' },
    { name: 'Sliggoo', sprite: '705' },
    { name: 'Goodra', sprite: '706' },
    { name: 'Klefki', sprite: '707' },
    { name: 'Phantump', sprite: '708' },
    { name: 'Trevenant', sprite: '709' },
    { name: 'Pumpkaboo', sprite: '710' },
    { name: 'Gourgeist', sprite: '711' },
    { name: 'Bergmite', sprite: '712' },
    { name: 'Avalugg', sprite: '713' },
    { name: 'Noibat', sprite: '714' },
    { name: 'Noivern', sprite: '715' },
    { name: 'Xerneas', sprite: '716' },
    { name: 'Yveltal', sprite: '717' },
    { name: 'Zygarde', sprite: '718' },
    { name: 'Diancie', sprite: '719' },
    { name: 'Hoopa', sprite: '720' },
    { name: 'Volcanion', sprite: '721' },
    // Gen 7
    { name: 'Rowlet', sprite: '722' },
    { name: 'Dartrix', sprite: '723' },
    { name: 'Decidueye', sprite: '724' },
    { name: 'Litten', sprite: '725' },
    { name: 'Torracat', sprite: '726' },
    { name: 'Incineroar', sprite: '727' },
    { name: 'Popplio', sprite: '728' },
    { name: 'Brionne', sprite: '729' },
    { name: 'Primarina', sprite: '730' },
    { name: 'Pikipek', sprite: '731' },
    { name: 'Trumbeak', sprite: '732' },
    { name: 'Toucannon', sprite: '733' },
    { name: 'Yungoos', sprite: '734' },
    { name: 'Gumshoos', sprite: '735' },
    { name: 'Grubbin', sprite: '736' },
    { name: 'Charjabug', sprite: '737' },
    { name: 'Vikavolt', sprite: '738' },
    { name: 'Crabrawler', sprite: '739' },
    { name: 'Crabominable', sprite: '740' },
    { name: 'Oricorio', sprite: '741' },
    { name: 'Cutiefly', sprite: '742' },
    { name: 'Ribombee', sprite: '743' },
    { name: 'Rockruff', sprite: '744' },
    { name: 'Lycanroc', sprite: '745' },
    { name: 'Wishiwashi', sprite: '746' },
    { name: 'Mareanie', sprite: '747' },
    { name: 'Toxapex', sprite: '748' },
    { name: 'Mudbray', sprite: '749' },
    { name: 'Mudsdale', sprite: '750' },
    { name: 'Dewpider', sprite: '751' },
    { name: 'Araquanid', sprite: '752' },
    { name: 'Fomantis', sprite: '753' },
    { name: 'Lurantis', sprite: '754' },
    { name: 'Morelull', sprite: '755' },
    { name: 'Shiinotic', sprite: '756' },
    { name: 'Salandit', sprite: '757' },
    { name: 'Salazzle', sprite: '758' },
    { name: 'Stufful', sprite: '759' },
    { name: 'Bewear', sprite: '760' },
    { name: 'Bounsweet', sprite: '761' },
    { name: 'Steenee', sprite: '762' },
    { name: 'Tsareena', sprite: '763' },
    { name: 'Comfey', sprite: '764' },
    { name: 'Oranguru', sprite: '765' },
    { name: 'Passimian', sprite: '766' },
    { name: 'Wimpod', sprite: '767' },
    { name: 'Golisopod', sprite: '768' },
    { name: 'Sandygast', sprite: '769' },
    { name: 'Palossand', sprite: '770' },
    { name: 'Pyukumuku', sprite: '771' },
    { name: 'Type: Null', sprite: '772' },
    { name: 'Silvally', sprite: '773' },
    { name: 'Minior', sprite: '774' },
    { name: 'Komala', sprite: '775' },
    { name: 'Turtonator', sprite: '776' },
    { name: 'Togedemaru', sprite: '777' },
    { name: 'Mimikyu', sprite: '778' },
    { name: 'Bruxish', sprite: '779' },
    { name: 'Drampa', sprite: '780' },
    { name: 'Dhelmise', sprite: '781' },
    { name: 'Jangmo-o', sprite: '782' },
    { name: 'Hakamo-o', sprite: '783' },
    { name: 'Kommo-o', sprite: '784' },
    { name: 'Tapu Koko', sprite: '785' },
    { name: 'Tapu Lele', sprite: '786' },
    { name: 'Tapu Bulu', sprite: '787' },
    { name: 'Tapu Fini', sprite: '788' },
    { name: 'Cosmog', sprite: '789' },
    { name: 'Cosmoem', sprite: '790' },
    { name: 'Solgaleo', sprite: '791' },
    { name: 'Lunala', sprite: '792' },
    { name: 'Nihilego', sprite: '793' },
    { name: 'Buzzwole', sprite: '794' },
    { name: 'Pheromosa', sprite: '795' },
    { name: 'Xurkitree', sprite: '796' },
    { name: 'Celesteela', sprite: '797' },
    { name: 'Kartana', sprite: '798' },
    { name: 'Guzzlord', sprite: '799' },
    { name: 'Necrozma', sprite: '800' },
    { name: 'Magearna', sprite: '801' },
    { name: 'Marshadow', sprite: '802' },
    { name: 'Poipole', sprite: '803' },
    { name: 'Naganadel', sprite: '804' },
    { name: 'Stakataka', sprite: '805' },
    { name: 'Blacephalon', sprite: '806' },
    { name: 'Zeraora', sprite: '807' },
    { name: 'Meltan', sprite: '808' },
    { name: 'Melmetal', sprite: '809' },
    // Gen 8
    { name: 'Grookey', sprite: '810' },
    { name: 'Thwackey', sprite: '811' },
    { name: 'Rillaboom', sprite: '812' },
    { name: 'Scorbunny', sprite: '813' },
    { name: 'Raboot', sprite: '814' },
    { name: 'Cinderace', sprite: '815' },
    { name: 'Sobble', sprite: '816' },
    { name: 'Drizzile', sprite: '817' },
    { name: 'Inteleon', sprite: '818' },
    { name: 'Skwovet', sprite: '819' },
    { name: 'Greedent', sprite: '820' },
    { name: 'Rookidee', sprite: '821' },
    { name: 'Corvisquire', sprite: '822' },
    { name: 'Corviknight', sprite: '823' },
    { name: 'Blipbug', sprite: '824' },
    { name: 'Dottler', sprite: '825' },
    { name: 'Orbeetle', sprite: '826' },
    { name: 'Nickit', sprite: '827' },
    { name: 'Thievul', sprite: '828' },
    { name: 'Gossifleur', sprite: '829' },
    { name: 'Eldegoss', sprite: '830' },
    { name: 'Wooloo', sprite: '831' },
    { name: 'Dubwool', sprite: '832' },
    { name: 'Chewtle', sprite: '833' },
    { name: 'Drednaw', sprite: '834' },
    { name: 'Yamper', sprite: '835' },
    { name: 'Boltund', sprite: '836' },
    { name: 'Rolycoly', sprite: '837' },
    { name: 'Carkol', sprite: '838' },
    { name: 'Coalossal', sprite: '839' },
    { name: 'Applin', sprite: '840' },
    { name: 'Flapple', sprite: '841' },
    { name: 'Appletun', sprite: '842' },
    { name: 'Silicobra', sprite: '843' },
    { name: 'Sandaconda', sprite: '844' },
    { name: 'Cramorant', sprite: '845' },
    { name: 'Arrokuda', sprite: '846' },
    { name: 'Barraskewda', sprite: '847' },
    { name: 'Toxel', sprite: '848' },
    { name: 'Toxtricity', sprite: '849' },
    { name: 'Sizzlipede', sprite: '850' },
    { name: 'Centiskorch', sprite: '851' },
    { name: 'Clobbopus', sprite: '852' },
    { name: 'Grapploct', sprite: '853' },
    { name: 'Sinistea', sprite: '854' },
    { name: 'Polteageist', sprite: '855' },
    { name: 'Hatenna', sprite: '856' },
    { name: 'Hattrem', sprite: '857' },
    { name: 'Hatterene', sprite: '858' },
    { name: 'Impidimp', sprite: '859' },
    { name: 'Morgrem', sprite: '860' },
    { name: 'Grimmsnarl', sprite: '861' },
    { name: 'Obstagoon', sprite: '862' },
    { name: 'Perrserker', sprite: '863' },
    { name: 'Cursola', sprite: '864' },
    { name: 'Sirfetchd', sprite: '865' },
    { name: 'Mr. Rime', sprite: '866' },
    { name: 'Runerigus', sprite: '867' },
    { name: 'Milcery', sprite: '868' },
    { name: 'Alcremie', sprite: '869' },
    { name: 'Falinks', sprite: '870' },
    { name: 'Pincurchin', sprite: '871' },
    { name: 'Snom', sprite: '872' },
    { name: 'Frosmoth', sprite: '873' },
    { name: 'Stonjourner', sprite: '874' },
    { name: 'Eiscue', sprite: '875' },
    { name: 'Indeedee', sprite: '876' },
    { name: 'Morpeko', sprite: '877' },
    { name: 'Cufant', sprite: '878' },
    { name: 'Copperajah', sprite: '879' },
    { name: 'Dracozolt', sprite: '880' },
    { name: 'Arctozolt', sprite: '881' },
    { name: 'Dracovish', sprite: '882' },
    { name: 'Arctovish', sprite: '883' },
    { name: 'Duraludon', sprite: '884' },
    { name: 'Dreepy', sprite: '885' },
    { name: 'Drakloak', sprite: '886' },
    { name: 'Dragapult', sprite: '887' },
    { name: 'Zacian', sprite: '888' },
    { name: 'Zamazenta', sprite: '889' },
    { name: 'Eternatus', sprite: '890' },
    { name: 'Kubfu', sprite: '891' },
    { name: 'Urshifu', sprite: '892' },
    { name: 'Zarude', sprite: '893' },
    { name: 'Regieleki', sprite: '894' },
    { name: 'Regidrago', sprite: '895' },
    { name: 'Glastrier', sprite: '896' },
    { name: 'Spectrier', sprite: '897' },
    { name: 'Calyrex', sprite: '898' },
    // Gen 9
    { name: 'Sprigatito', sprite: '906' },
    { name: 'Floragato', sprite: '907' },
    { name: 'Meowscarada', sprite: '908' },
    { name: 'Fuecoco', sprite: '909' },
    { name: 'Crocalor', sprite: '910' },
    { name: 'Skeledirge', sprite: '911' },
    { name: 'Quaxly', sprite: '912' },
    { name: 'Quaxwell', sprite: '913' },
    { name: 'Quaquaval', sprite: '914' },
    { name: 'Lechonk', sprite: '915' },
    { name: 'Oinkologne', sprite: '916' },
    { name: 'Tarountula', sprite: '917' },
    { name: 'Spidops', sprite: '918' },
    { name: 'Nymble', sprite: '919' },
    { name: 'Lokix', sprite: '920' },
    { name: 'Pawmi', sprite: '921' },
    { name: 'Pawmo', sprite: '922' },
    { name: 'Pawmot', sprite: '923' },
    { name: 'Tandemaus', sprite: '924' },
    { name: 'Maushold', sprite: '925' },
    { name: 'Fidough', sprite: '926' },
    { name: 'Dachsbun', sprite: '927' },
    { name: 'Smoliv', sprite: '928' },
    { name: 'Dolliv', sprite: '929' },
    { name: 'Arboliva', sprite: '930' },
    { name: 'Squawkabilly', sprite: '931' },
    { name: 'Nacli', sprite: '932' },
    { name: 'Naclstack', sprite: '933' },
    { name: 'Garganacl', sprite: '934' },
    { name: 'Charcadet', sprite: '935' },
    { name: 'Armarouge', sprite: '936' },
    { name: 'Ceruledge', sprite: '937' },
    { name: 'Tadbulb', sprite: '938' },
    { name: 'Bellibolt', sprite: '939' },
    { name: 'Wattrel', sprite: '940' },
    { name: 'Kilowattrel', sprite: '941' },
    { name: 'Maschiff', sprite: '942' },
    { name: 'Mabosstiff', sprite: '943' },
    { name: 'Shroodle', sprite: '944' },
    { name: 'Grafaiai', sprite: '945' },
    { name: 'Bramblin', sprite: '946' },
    { name: 'Brambleghast', sprite: '947' },
    { name: 'Toedscool', sprite: '948' },
    { name: 'Toedscruel', sprite: '949' },
    { name: 'Klawf', sprite: '950' },
    { name: 'Capsakid', sprite: '951' },
    { name: 'Scovillain', sprite: '952' },
    { name: 'Rellor', sprite: '953' },
    { name: 'Rabsca', sprite: '954' },
    { name: 'Flittle', sprite: '955' },
    { name: 'Espathra', sprite: '956' },
    { name: 'Tinkatink', sprite: '957' },
    { name: 'Tinkatuff', sprite: '958' },
    { name: 'Tinkaton', sprite: '959' },
    { name: 'Wiglett', sprite: '960' },
    { name: 'Wugtrio', sprite: '961' },
    { name: 'Bombirdier', sprite: '962' },
    { name: 'Finizen', sprite: '963' },
    { name: 'Palafin', sprite: '964' },
    { name: 'Varoom', sprite: '965' },
    { name: 'Revavroom', sprite: '966' },
    { name: 'Cyclizar', sprite: '967' },
    { name: 'Orthworm', sprite: '968' },
    { name: 'Glimmet', sprite: '969' },
    { name: 'Glimmora', sprite: '970' },
    { name: 'Greavard', sprite: '971' },
    { name: 'Houndstone', sprite: '972' },
    { name: 'Flamigo', sprite: '973' },
    { name: 'Cetoddle', sprite: '974' },
    { name: 'Cetitan', sprite: '975' },
    { name: 'Veluza', sprite: '976' },
    { name: 'Dondozo', sprite: '977' },
    { name: 'Tatsugiri', sprite: '978' },
    { name: 'Annihilape', sprite: '979' },
    { name: 'Clodsire', sprite: '980' },
    { name: 'Farigiraf', sprite: '981' },
    { name: 'Dudunsparce', sprite: '982' },
    { name: 'Kingambit', sprite: '983' },
    { name: 'Great Tusk', sprite: '984' },
    { name: 'Scream Tail', sprite: '985' },
    { name: 'Brute Bonnet', sprite: '986' },
    { name: 'Flutter Mane', sprite: '987' },
    { name: 'Slither Wing', sprite: '988' },
    { name: 'Sandy Shocks', sprite: '989' },
    { name: 'Iron Treads', sprite: '990' },
    { name: 'Iron Bundle', sprite: '991' },
    { name: 'Iron Hands', sprite: '992' },
    { name: 'Iron Jugulis', sprite: '993' },
    { name: 'Iron Moth', sprite: '994' },
    { name: 'Iron Thorns', sprite: '995' },
    { name: 'Frigibax', sprite: '996' },
    { name: 'Arctibax', sprite: '997' },
    { name: 'Baxcalibur', sprite: '998' },
    { name: 'Gimmighoul', sprite: '999' },
    { name: 'Gholdengo', sprite: '1000' },
    { name: 'Wo-Chien', sprite: '1001' },
    { name: 'Chien-Pao', sprite: '1002' },
    { name: 'Ting-Lu', sprite: '1003' },
    { name: 'Chi-Yu', sprite: '1004' },
    { name: 'Roaring Moon', sprite: '1005' },
    { name: 'Iron Valiant', sprite: '1006' },
    { name: 'Koraidon', sprite: '1007' },
    { name: 'Miraidon', sprite: '1008' },
    { name: 'Walking Wake', sprite: '1009' },
    { name: 'Iron Leaves', sprite: '1010' },
    { name: 'Dipplin', sprite: '1011' },
    { name: 'Poltchageist', sprite: '1012' },
    { name: 'Sinistcha', sprite: '1013' },
    { name: 'Okidogi', sprite: '1014' },
    { name: 'Munkidori', sprite: '1015' },
    { name: 'Fezandipiti', sprite: '1016' },
    { name: 'Ogerpon', sprite: '1017' },
    { name: 'Archaludon', sprite: '1018' },
    { name: 'Hydrapple', sprite: '1019' },
    { name: 'Gouging Fire', sprite: '1020' },
    { name: 'Raging Bolt', sprite: '1021' },
    { name: 'Iron Boulder', sprite: '1022' },
    { name: 'Iron Crown', sprite: '1023' },
    { name: 'Terapagos', sprite: '1024' },
    { name: 'Pecharunt', sprite: '1025' },
  ]
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Drawing Canvas Component for Drawing Mode - Upgraded!
function DrawingCanvas({ pokemonName, onDrawingUpdate }) {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [color, setColor] = React.useState('#000000');
  const [brushSize, setBrushSize] = React.useState(3);
  const [history, setHistory] = React.useState([]);
  const [isEraser, setIsEraser] = React.useState(false);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imageData = canvas.toDataURL();
    setHistory(prev => [...prev, imageData]);
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Clamp mouse position to canvas display area FIRST
    const clientX = Math.max(rect.left, Math.min(rect.right, e.clientX));
    const clientY = Math.max(rect.top, Math.min(rect.bottom, e.clientY));
    
    // Account for canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    // Save state before starting new stroke
    saveToHistory();
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Clamp mouse position to canvas display area FIRST
    const clientX = Math.max(rect.left, Math.min(rect.right, e.clientX));
    const clientY = Math.max(rect.top, Math.min(rect.bottom, e.clientY));
    
    // Account for canvas scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && canvasRef.current) {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL();
      onDrawingUpdate(imageData);
    }
    setIsDrawing(false);
  };

  const undo = () => {
    if (history.length === 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const previousState = history[history.length - 1];
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      onDrawingUpdate(canvas.toDataURL());
    };
    img.src = previousState;
    
    setHistory(prev => prev.slice(0, -1));
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveToHistory();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onDrawingUpdate(null);
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
  }, [pokemonName]);

  // More colors like Gartic Phone / Scribble.io
  const colors = [
    '#000000', // Black
    '#FFFFFF', // White  
    '#808080', // Gray
    '#C0C0C0', // Silver
    '#FF0000', // Red
    '#800000', // Maroon
    '#FFFF00', // Yellow
    '#FFA500', // Orange
    '#FFC0CB', // Pink
    '#FF1493', // Deep Pink
    '#800080', // Purple
    '#8B00FF', // Violet
    '#0000FF', // Blue
    '#00BFFF', // Sky Blue
    '#00FFFF', // Cyan
    '#008080', // Teal
    '#00FF00', // Lime
    '#008000', // Green
    '#90EE90', // Light Green
    '#A52A2A', // Brown
  ];

  const sizes = [
    { size: 2, label: 'XS' },
    { size: 5, label: 'S' },
    { size: 10, label: 'M' },
    { size: 20, label: 'L' },
    { size: 35, label: 'XL' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col items-center">
      <div className="text-center mb-3">
        <div className="text-sm font-bold text-gray-700">Draw: {pokemonName}</div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={3000}
        height={3000}
        className="border-4 border-gray-300 rounded-lg cursor-crosshair bg-white mx-auto overflow-hidden"
        style={{ width: '1200px', height: '1200px', maxWidth: '90vw', touchAction: 'none', overflow: 'hidden' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      
      <div className="mt-4 space-y-3 w-full max-w-4xl">
        {/* Brush Sizes */}
        <div>
          <div className="text-xs font-bold text-gray-600 mb-2">Brush Size:</div>
          <div className="flex gap-2 justify-center">
            {sizes.map(s => (
              <button
                key={s.size}
                onClick={() => { setBrushSize(s.size); setIsEraser(false); }}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  brushSize === s.size && !isEraser
                    ? 'bg-blue-500 text-white scale-110' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div className="text-xs font-bold text-gray-600 mb-2">Colors:</div>
          <div className="flex gap-2 justify-center flex-wrap">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setIsEraser(false); }}
                className={`w-8 h-8 rounded-lg border-2 transition-transform ${
                  color === c && !isEraser ? 'border-gray-800 scale-125 ring-2 ring-blue-400' : 'border-gray-400'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`py-3 rounded-lg font-bold transition-all ${
              isEraser
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isEraser ? '🧹 Erasing' : '🧹 Eraser'}
          </button>
          
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↶ Undo
          </button>
          
          <button
            onClick={clearCanvas}
            className="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 font-bold"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
    </div>
  );
}

// Animated Pokemon Background Component for Lobby
function AnimatedPokemonBackground() {
  const [sprites, setSprites] = React.useState([]);

  React.useEffect(() => {
    // Generate random Pokemon sprites
    const generateSprites = () => {
      const newSprites = [];
      const spriteCount = 150; // TONS of Pokemon sprites!
      
      for (let i = 0; i < spriteCount; i++) {
        const randomPokemonId = Math.floor(Math.random() * 1025) + 1;
        
        newSprites.push({
          id: i,
          pokemonId: randomPokemonId,
          x: Math.random() * 100, // Random x position (percentage)
          y: Math.random() * 100, // Random y position (percentage)
          direction: Math.random() < 0.5 ? 'diagonal-up' : 'diagonal-down', // Arrow direction from image
          speed: 0.3 + Math.random() * 0.8, // Random speed
          size: 35 + Math.random() * 50, // Random size 35-85px
        });
      }
      
      setSprites(newSprites);
    };

    generateSprites();
  }, []);

  React.useEffect(() => {
    // Animate sprites
    const interval = setInterval(() => {
      setSprites(prevSprites => 
        prevSprites.map(sprite => {
          let newX = sprite.x;
          let newY = sprite.y;

          // Move based on direction (like arrows in your image)
          if (sprite.direction === 'diagonal-up') {
            // Move up-right ↗
            newX += sprite.speed * 0.1;
            newY -= sprite.speed * 0.15;
          } else {
            // Move down-right ↘
            newX += sprite.speed * 0.1;
            newY += sprite.speed * 0.15;
          }

          // Reset position when sprite goes off screen
          if (newX > 110 || newY < -10 || newY > 110) {
            newX = -10;
            newY = Math.random() * 100;
            // Randomize direction again
            sprite.direction = Math.random() < 0.5 ? 'diagonal-up' : 'diagonal-down';
          }

          return { ...sprite, x: newX, y: newY };
        })
      );
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {sprites.map(sprite => (
        <img
          key={sprite.id}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${sprite.pokemonId}.png`}
          alt=""
          className="absolute transition-opacity duration-300"
          style={{
            left: `${sprite.x}%`,
            top: `${sprite.y}%`,
            width: `${sprite.size}px`,
            height: `${sprite.size}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

export default function PokeDescribe() {
  const [screen, setScreen] = useState('main-menu');
  const [gameState, setGameState] = useState('difficulty');
  const [gameMode, setGameMode] = useState(null); // 'classic' or 'drawing'
  const [fixedDifficulty, setFixedDifficulty] = useState(null); // 'easy', 'medium', 'hard', or null for mixed
  const [roomCode, setRoomCode] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [guessInput, setGuessInput] = useState('');
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalRounds] = useState(8);
  const [stealTeamIndex, setStealTeamIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [drawingData, setDrawingData] = useState(null); // For storing drawing canvas data

  // Listen for real-time player updates
  useEffect(() => {
    if (screen === 'lobby' && roomCode) {
      const playersRef = ref(database, `rooms/${roomCode}/players`);
      const unsubscribe = onValue(playersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const playersList = Object.values(data);
          setPlayers(playersList);
        }
      });

      return () => unsubscribe();
    }
  }, [screen, roomCode]);

  // Listen for game start signal
  useEffect(() => {
    if (roomCode && database) {
      const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
      const unsubscribe = onValue(gameStateRef, (snapshot) => {
        const data = snapshot.val();
        // If we're in lobby and game state exists, transition to game
        if (data && screen === 'lobby') {
          setScreen('game');
        }
      });

      return () => unsubscribe();
    }
  }, [roomCode, screen]);

  // Game State Sync Functions
  const syncGameState = async (state) => {
    if (!database || !roomCode) return;
    try {
      await set(ref(database, `rooms/${roomCode}/gameState`), state);
    } catch (error) {
      console.error('Sync game state error:', error);
    }
  };

  const syncDrawing = async (imageData) => {
    if (!roomCode || !database) return;
    try {
      await set(ref(database, `rooms/${roomCode}/gameState/drawingData`), imageData);
    } catch (error) {
      console.error('Sync drawing error:', error);
    }
  };

  // Listen for game state updates - with proper cleanup
  useEffect(() => {
    if (screen === 'game' && roomCode && database) {
      console.log('Setting up game state listener...');
      const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
      const unsubscribe = onValue(gameStateRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Game state update received:', data);
        if (data) {
          setGameState(data.phase);
          setCurrentTeamIndex(data.currentTeamIndex || 0);
          setCurrentPokemon(data.currentPokemon);
          setDifficulty(data.difficulty);
          setTimeLeft(data.timeLeft || 60);
          setRoundNumber(data.roundNumber || 1);
          if (data.teams) setTeams(data.teams);
          if (data.drawingData !== undefined) setDrawingData(data.drawingData);
        }
      });
      
      return () => unsubscribe();
    }
  }, [screen, roomCode]);

  const createGame = async () => {
    const code = generateRoomCode();
    const name = playerName.trim() || 'Player';
    const playerId = Date.now().toString();
    
    setRoomCode(code);
    setMyPlayerId(playerId);
    setIsLoading(true);

    try {
      const roomRef = ref(database, `rooms/${code}`);
      const player = { id: playerId, name: name, team: null, role: null };
      
      await set(roomRef, {
        created: Date.now(),
        gameMode: gameMode || 'classic',
        fixedDifficulty: fixedDifficulty,
        players: { [playerId]: player }
      });
      
      setPlayers([player]);
      setScreen('lobby');
    } catch (error) {
      console.error('Create game error:', error);
      setErrorMessage('Failed to create game. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async () => {
    if (joinCodeInput.trim().length < 4) return;
    
    const code = joinCodeInput.toUpperCase();
    const name = playerName.trim() || 'Player';
    const playerId = Date.now().toString();
    
    setIsLoading(true);

    try {
      const roomRef = ref(database, `rooms/${code}`);
      const snapshot = await get(roomRef);
      
      if (!snapshot.exists()) {
        setErrorMessage('Room code not found! Please check the code and try again.');
        setTimeout(() => setErrorMessage(''), 3000);
        setIsLoading(false);
        return;
      }

      const roomData = snapshot.val();
      
      // Load game settings
      setGameMode(roomData.gameMode || 'classic');
      setFixedDifficulty(roomData.fixedDifficulty || null);

      const player = { id: playerId, name: name, team: null, role: null };
      
      await set(ref(database, `rooms/${code}/players/${playerId}`), player);
      
      setRoomCode(code);
      setMyPlayerId(playerId);
      setScreen('lobby');
    } catch (error) {
      console.error('Join game error:', error);
      setErrorMessage('Failed to join game. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const assignToTeam = async (teamIndex) => {
    if (!myPlayerId) return;
    
    try {
      const playerRef = ref(database, `rooms/${roomCode}/players/${myPlayerId}`);
      const snapshot = await get(playerRef);
      const playerData = snapshot.val();
      
      await set(playerRef, { ...playerData, team: teamIndex });
    } catch (error) {
      console.error('Assign team error:', error);
    }
  };

  const setMyRole = async (role) => {
    if (!myPlayerId) return;
    
    const myPlayer = players.find(p => p.id === myPlayerId);
    
    if (role === 'noob' && myPlayer?.team !== null) {
      const teamPlayers = players.filter(p => p.team === myPlayer.team && p.id !== myPlayerId);
      const hasNoob = teamPlayers.some(p => p.role === 'noob');
      
      if (hasNoob) {
        setErrorMessage('This team already has a Noob!');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
    }
    
    try {
      const playerRef = ref(database, `rooms/${roomCode}/players/${myPlayerId}`);
      const snapshot = await get(playerRef);
      const playerData = snapshot.val();
      
      await set(playerRef, { ...playerData, role });
    } catch (error) {
      console.error('Set role error:', error);
    }
  };

  const startGame = async () => {
    console.log('Starting game...');
    const teamMap = {};
    players.forEach(p => {
      if (p.team !== null) {
        if (!teamMap[p.team]) {
          teamMap[p.team] = { noobs: [], pros: [] };
        }
        if (p.role === 'noob') teamMap[p.team].noobs.push(p.name);
        else if (p.role === 'pro') teamMap[p.team].pros.push(p.name);
      }
    });

    const newTeams = Object.entries(teamMap).map(([idx, members]) => ({
      id: parseInt(idx),
      name: `Team ${parseInt(idx) + 1}`,
      color: COLORS[parseInt(idx) % COLORS.length],
      score: 0,
      noob: members.noobs[0] || 'Noob',
      pros: members.pros.length > 0 ? members.pros : ['Pro']
    }));
    
    console.log('Created teams:', newTeams);
    
    // Update Firebase first, then local state will update via listener
    await syncGameState({
      phase: 'difficulty',
      currentTeamIndex: 0,
      roundNumber: 1,
      teams: newTeams,
      timeLeft: 60
    });
    
    console.log('Game state synced, moving to game screen');
    
    // Move to game screen
    setScreen('game');
  };

  useEffect(() => {
    if (screen === 'game' && (gameState === 'describing' || gameState === 'drawing' || gameState === 'steal')) {
      // Only the first player (host) runs the timer
      const isHost = players.length > 0 && players[0]?.id === myPlayerId;
      
      if (isHost && timeLeft > 0) {
        const timer = setTimeout(async () => {
          const newTime = timeLeft - 1;
          
          // If time just hit 0, transition phases immediately
          if (newTime <= 0) {
            if (gameState === 'describing' || gameState === 'drawing') {
              // Transition to steal phase
              await syncGameState({
                phase: 'steal',
                currentTeamIndex,
                roundNumber,
                teams,
                difficulty,
                currentPokemon,
                timeLeft: 30,
                gameMode: gameMode
              });
            } else if (gameState === 'steal') {
              // Transition to round-end
              await syncGameState({
                phase: 'round-end',
                currentTeamIndex,
                roundNumber,
                teams,
                difficulty,
                currentPokemon,
                gameMode: gameMode
              });
            }
          } else {
            // Normal countdown - just update time
            setTimeLeft(newTime);
            await syncGameState({
              phase: gameState,
              currentTeamIndex,
              roundNumber,
              teams,
              difficulty,
              currentPokemon,
              timeLeft: newTime,
              gameMode: gameMode,
              drawingData: drawingData
            });
          }
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [timeLeft, gameState, screen, myPlayerId, players, drawingData]);

  const selectDifficulty = async (diff) => {
    // If fixed difficulty is set, use that instead
    const actualDifficulty = fixedDifficulty || diff;
    const pool = POKEMON_POOLS[actualDifficulty];
    const pokemon = pool[Math.floor(Math.random() * pool.length)];
    
    // Update Firebase first, then local state will update via listener
    await syncGameState({
      phase: gameMode === 'drawing' ? 'drawing' : 'describing',
      currentTeamIndex,
      roundNumber,
      teams,
      difficulty: actualDifficulty,
      currentPokemon: pokemon,
      timeLeft: 60,
      gameMode: gameMode
    });
  };

  const handleGuess = async (teamIndex) => {
    const guess = guessInput.trim().toLowerCase();
    const correct = currentPokemon.name.toLowerCase();
    
    if (guess === correct) {
      const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      const updatedTeams = teams.map((team, i) => 
        i === teamIndex ? { ...team, score: team.score + points } : team
      );
      
      setGuessInput('');
      
      // Update Firebase, local state will update via listener
      await syncGameState({
        phase: 'round-end',
        currentTeamIndex,
        roundNumber,
        teams: updatedTeams,
        difficulty,
        currentPokemon
      });
    } else {
      setGuessInput('');
    }
  };

  const nextRound = async () => {
    if (roundNumber >= totalRounds) {
      await syncGameState({
        phase: 'game-over',
        currentTeamIndex,
        roundNumber,
        teams,
        difficulty,
        currentPokemon
      });
    } else {
      const newRound = roundNumber + 1;
      const newTeamIndex = (currentTeamIndex + 1) % teams.length;
      
      // Update Firebase, local state will update via listener
      await syncGameState({
        phase: 'difficulty',
        currentTeamIndex: newTeamIndex,
        roundNumber: newRound,
        teams,
        timeLeft: 60
      });
    }
  };

  const resetGame = async () => {
    if (roomCode) {
      try {
        await remove(ref(database, `rooms/${roomCode}`));
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }
    
    setScreen('main-menu');
    setGameState('difficulty');
    setTeams([]);
    setPlayers([]);
    setCurrentTeamIndex(0);
    setCurrentPokemon(null);
    setDifficulty(null);
    setRoundNumber(1);
    setStealTeamIndex(null);
    setRoomCode('');
    setJoinCodeInput('');
    setPlayerName('');
    setErrorMessage('');
    setMyPlayerId(null);
  };

  if (screen === 'main-menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 flex items-center justify-center relative overflow-hidden">
        <AnimatedPokemonBackground />
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl p-12 max-w-2xl w-full relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              PokéDescribe
            </h1>
            <p className="text-2xl text-gray-300">The party game where Pokémon knowledge is optional!</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-900/50 border-2 border-red-500 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-red-200 font-bold text-lg">⚠️ {errorMessage}</div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-200 mb-3">Your Display Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
              maxLength={20}
            />
          </div>

          <div className="space-y-6">
            <button
              onClick={() => setScreen('game-mode-select')}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl font-bold py-8 rounded-2xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
            >
              Create Game
            </button>

            <button
              onClick={() => setScreen('join-game')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-3xl font-bold py-8 rounded-2xl hover:scale-105 transition-transform shadow-lg"
            >
              Join Game
            </button>
          </div>

          <div className="mt-12 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2 text-yellow-800">Quick Rules:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>🎮 Each team has a Noob (describer) and Pros (guessers)</li>
              <li>⏱️ 60 seconds to describe, 30 seconds for steals</li>
              <li>🚫 Can't say the Pokémon's name or spell letters</li>
              <li>✨ Easy = 1pt, Medium = 2pts, Hard = 3pts</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'game-mode-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 flex items-center justify-center relative overflow-hidden">
        <AnimatedPokemonBackground />
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl p-12 max-w-4xl w-full relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              Select Game Mode
            </h1>
            <p className="text-xl text-gray-300">Choose how you want to play!</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Classic Mode */}
            <button
              onClick={() => {
                setGameMode('classic');
                setScreen('difficulty-select');
              }}
              className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl p-8 hover:scale-105 transition-all shadow-lg"
            >
              <div className="text-6xl mb-4">💬</div>
              <div className="text-3xl font-bold mb-2">Classic Mode</div>
              <div className="text-lg opacity-90">Describe the Pokémon with words!</div>
              <div className="mt-4 text-sm opacity-75">
                The Noob describes, the Pros guess
              </div>
            </button>

            {/* Drawing Mode */}
            <button
              onClick={() => {
                setGameMode('drawing');
                setScreen('difficulty-select');
              }}
              className="bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-2xl p-8 hover:scale-105 transition-all shadow-lg"
            >
              <div className="text-6xl mb-4">🎨</div>
              <div className="text-3xl font-bold mb-2">Drawing Mode</div>
              <div className="text-lg opacity-90">Draw the Pokémon on a canvas!</div>
              <div className="mt-4 text-sm opacity-75">
                The Noob draws, the Pros guess
              </div>
            </button>
          </div>

          <button
            onClick={() => setScreen('main-menu')}
            className="w-full bg-gray-300 text-gray-700 text-xl font-bold py-4 rounded-xl hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'difficulty-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 flex items-center justify-center relative overflow-hidden">
        <AnimatedPokemonBackground />
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl p-12 max-w-4xl w-full relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              Select Difficulty Mode
            </h1>
            <p className="text-xl text-gray-300">Choose your Pokémon difficulty</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Mixed Difficulty */}
            <button
              onClick={() => {
                setFixedDifficulty(null);
                createGame();
              }}
              className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl p-8 hover:scale-105 transition-all shadow-lg"
            >
              <div className="text-5xl mb-3">🎲</div>
              <div className="text-2xl font-bold mb-2">Mixed</div>
              <div className="text-sm opacity-90">Choose difficulty each round</div>
              <div className="mt-2 text-xs opacity-75">Classic gameplay</div>
            </button>

            {/* All Easy */}
            <button
              onClick={() => {
                setFixedDifficulty('easy');
                createGame();
              }}
              className="bg-green-500 text-white rounded-2xl p-8 hover:scale-105 transition-all shadow-lg"
            >
              <div className="text-5xl mb-3">😊</div>
              <div className="text-2xl font-bold mb-2">All Easy</div>
              <div className="text-sm opacity-90">Only iconic Pokémon</div>
              <div className="mt-2 text-xs opacity-75">1 point per guess</div>
            </button>

            {/* All Medium */}
            <button
              onClick={() => {
                setFixedDifficulty('medium');
                createGame();
              }}
              className="bg-yellow-500 text-white rounded-2xl p-8 hover:scale-105 transition-all shadow-lg"
            >
              <div className="text-5xl mb-3">🤔</div>
              <div className="text-2xl font-bold mb-2">All Medium</div>
              <div className="text-sm opacity-90">Popular but less iconic</div>
              <div className="mt-2 text-xs opacity-75">2 points per guess</div>
            </button>

            {/* All Hard */}
            <button
              onClick={() => {
                setFixedDifficulty('hard');
                createGame();
              }}
              className="bg-red-500 text-white rounded-2xl p-8 hover:scale-105 transition-all shadow-lg"
            >
              <div className="text-5xl mb-3">😰</div>
              <div className="text-2xl font-bold mb-2">All Hard</div>
              <div className="text-sm opacity-90">Obscure Pokémon</div>
              <div className="mt-2 text-xs opacity-75">3 points per guess</div>
            </button>
          </div>

          <button
            onClick={() => setScreen('game-mode-select')}
            className="w-full bg-gray-300 text-gray-700 text-xl font-bold py-4 rounded-xl hover:bg-gray-400 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'join-game') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 flex items-center justify-center relative overflow-hidden">
        <AnimatedPokemonBackground />
        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl p-12 max-w-2xl w-full relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-4">
              Join Game
            </h1>
            <p className="text-xl text-gray-300">Enter the room code to join</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-900/50 border-2 border-red-500 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-red-200 font-bold text-lg">⚠️ {errorMessage}</div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-gray-200 mb-3">Room Code</label>
              <input
                type="text"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && joinGame()}
                placeholder="Enter code..."
                className="w-full px-6 py-4 text-3xl text-center font-bold border-4 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 uppercase tracking-wider"
                maxLength={8}
                autoFocus
              />
            </div>

            <button
              onClick={joinGame}
              disabled={joinCodeInput.trim().length < 4 || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-2xl font-bold py-6 rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Joining...' : 'Join Game'}
            </button>

            <button
              onClick={() => setScreen('main-menu')}
              className="w-full bg-gray-300 text-gray-700 text-xl font-bold py-4 rounded-xl hover:bg-gray-400 transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'lobby') {
    const numTeams = 4;
    const myPlayer = players.find(p => p.id === myPlayerId);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden">
        {/* Animated Pokemon Background */}
        <AnimatedPokemonBackground />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                Game Lobby
              </h1>
              <p className="text-xl text-gray-300">Choose your team and role</p>
              <div className="mt-4 flex gap-4 justify-center items-center">
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-2 border-purple-400/50 rounded-xl px-6 py-2">
                  <div className="text-sm font-bold text-purple-300">
                    Mode: {gameMode === 'drawing' ? '🎨 Drawing' : '💬 Classic'}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border-2 border-orange-400/50 rounded-xl px-6 py-2">
                  <div className="text-sm font-bold text-orange-300">
                    Difficulty: {fixedDifficulty ? (
                      fixedDifficulty === 'easy' ? '😊 All Easy' :
                      fixedDifficulty === 'medium' ? '🤔 All Medium' :
                      '😰 All Hard'
                    ) : '🎲 Mixed'}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-green-400 font-bold">
                🔥 {players.length} player{players.length !== 1 ? 's' : ''} connected (Real-time synced!)
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 bg-red-900/50 border-2 border-red-500 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="text-red-200 font-bold text-lg">⚠️ {errorMessage}</div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4 mb-8">
              {Array.from({ length: numTeams }).map((_, teamIdx) => {
                const teamPlayers = players.filter(p => p.team === teamIdx);
                const noobs = teamPlayers.filter(p => p.role === 'noob');
                const pros = teamPlayers.filter(p => p.role === 'pro');
                
                return (
                  <div 
                    key={teamIdx}
                    className="rounded-2xl p-4 min-h-[300px] backdrop-blur-sm"
                    style={{ backgroundColor: `${COLORS[teamIdx]}30`, borderColor: COLORS[teamIdx], borderWidth: '3px' }}
                  >
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold" style={{ color: COLORS[teamIdx] }}>
                        Team {teamIdx + 1}
                      </div>
                      <div className="text-sm text-gray-300">{teamPlayers.length} players</div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-gray-400 mb-1">NOOBS</div>
                        {noobs.map(p => (
                          <div key={p.id} className="bg-white rounded-lg px-3 py-2 text-sm font-medium mb-1 flex items-center justify-between">
                            <span>{p.name}</span>
                            {p.id === myPlayerId && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">YOU</span>}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-gray-400 mb-1">PROS</div>
                        {pros.map(p => (
                          <div key={p.id} className="bg-white/90 rounded-lg px-3 py-2 text-sm font-medium mb-1 flex items-center justify-between">
                            <span>{p.name}</span>
                            {p.id === myPlayerId && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">YOU</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {myPlayer && (
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-4 border-blue-400/50 rounded-2xl p-8 mb-6 backdrop-blur-sm">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-blue-300 mb-2">Your Selection</h2>
                  <p className="text-lg text-gray-300">Choose your team and role</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-lg font-bold text-gray-200 mb-3 text-center">
                      Select Team {myPlayer.team !== null && `(Currently: Team ${myPlayer.team + 1})`}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: numTeams }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => assignToTeam(idx)}
                          className={`py-4 rounded-xl font-bold text-white hover:scale-105 transition-transform ${
                            myPlayer.team === idx ? 'ring-4 ring-offset-2 ring-offset-gray-800 ring-blue-400 scale-105' : ''
                          }`}
                          style={{ backgroundColor: COLORS[idx] }}
                        >
                          Team {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-lg font-bold text-gray-200 mb-3 text-center">
                      Select Role {myPlayer.role && `(Currently: ${myPlayer.role === 'noob' ? 'Noob' : 'Pro'})`}
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                      <button
                        onClick={() => setMyRole('noob')}
                        className={`py-6 rounded-xl font-bold text-xl transition-all ${
                          myPlayer.role === 'noob'
                            ? 'bg-orange-500 text-white ring-4 ring-offset-2 ring-orange-500 scale-105'
                            : 'bg-orange-200 text-orange-700 hover:bg-orange-300 hover:scale-105'
                        }`}
                      >
                        <div className="text-3xl mb-1">🎨</div>
                        Noob
                        <div className="text-xs mt-1">Describer</div>
                      </button>
                      <button
                        onClick={() => setMyRole('pro')}
                        className={`py-6 rounded-xl font-bold text-xl transition-all ${
                          myPlayer.role === 'pro'
                            ? 'bg-green-500 text-white ring-4 ring-offset-2 ring-green-500 scale-105'
                            : 'bg-green-200 text-green-700 hover:bg-green-300 hover:scale-105'
                        }`}
                      >
                        <div className="text-3xl mb-1">🎯</div>
                        Pro
                        <div className="text-xs mt-1">Guesser</div>
                      </button>
                    </div>
                  </div>

                  {myPlayer.team !== null && myPlayer.role !== null && (
                    <div className="text-center bg-green-100 border-2 border-green-400 rounded-xl p-4">
                      <div className="text-green-700 font-bold text-lg">
                        ✓ Ready! You're on Team {myPlayer.team + 1} as a {myPlayer.role === 'noob' ? 'Noob' : 'Pro'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Other Players in Lobby</h3>
              
              {players.filter(p => p.id !== myPlayerId).length === 0 ? (
                <div className="text-center text-gray-500 italic py-8">
                  Waiting for other players to join...
                  <div className="text-sm mt-2">Share the room code with your friends!</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {players.filter(p => p.id !== myPlayerId).map(player => (
                    <div key={player.id} className="bg-white rounded-xl p-4 shadow">
                      <div className="font-bold text-lg mb-2">{player.name}</div>
                      {player.team !== null && player.role !== null ? (
                        <div className="text-sm text-gray-600">
                          <span className="font-bold" style={{ color: COLORS[player.team] }}>Team {player.team + 1}</span>
                          {' · '}
                          <span className={player.role === 'noob' ? 'text-orange-600' : 'text-green-600'}>
                            {player.role === 'noob' ? 'Noob' : 'Pro'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">Choosing team & role...</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl px-6 py-4">
                <div className="text-sm font-bold text-blue-700 mb-1">Room Code</div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-blue-600 tracking-wider">{roomCode}</div>
                  <button
                    onClick={copyRoomCode}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    title="Copy code"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <button
                onClick={startGame}
                disabled={players.some(p => p.team === null || p.role === null)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold px-12 py-6 rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'game') {
    const currentTeam = teams[currentTeamIndex];

    // Safety check - if teams aren't loaded yet, show loading
    if (!currentTeam || teams.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 flex items-center justify-center relative overflow-hidden">
          <AnimatedPokemonBackground />
          <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-3xl shadow-2xl p-12 text-center relative z-10">
            <div className="text-4xl font-bold text-blue-400 mb-4">Loading game...</div>
            <div className="text-xl text-gray-300">Syncing with other players</div>
          </div>
        </div>
      );
    }

    if (gameState === 'difficulty') {
      // Check if current player is the Noob whose turn it is
      const myPlayer = players.find(p => p.id === myPlayerId);
      const isCurrentNoob = myPlayer?.role === 'noob' && myPlayer?.team === currentTeamIndex;
      
      // If fixed difficulty is set, auto-select it
      if (fixedDifficulty) {
        // Auto-select the fixed difficulty
        React.useEffect(() => {
          selectDifficulty(fixedDifficulty);
        }, []);
        
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden">
        <AnimatedPokemonBackground />
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-4">Starting Round...</div>
                  <div className="text-xl text-gray-600">
                    Difficulty: {fixedDifficulty.charAt(0).toUpperCase() + fixedDifficulty.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden">
        <AnimatedPokemonBackground />
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold text-gray-800">Round {roundNumber}/{totalRounds}</div>
                <div className="flex gap-4">
                  {teams.map(team => (
                    <div key={team.id} className="text-center">
                      <div className="font-bold" style={{ color: team.color }}>{team.name}</div>
                      <div className="text-3xl font-bold">{team.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-full text-xl font-bold mb-4">
                  {currentTeam.name}'s Turn
                </div>
                <p className="text-gray-600 text-lg">
                  <span className="font-bold">{currentTeam.noob}</span> (Noob), choose your difficulty!
                </p>
                {!isCurrentNoob && (
                  <p className="text-red-600 font-bold mt-2">
                    ⏳ Waiting for {currentTeam.noob} to choose...
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6">
                <button
                  onClick={() => isCurrentNoob && selectDifficulty('easy')}
                  disabled={!isCurrentNoob}
                  className={`rounded-2xl p-8 transition-all shadow-lg ${
                    isCurrentNoob 
                      ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">😊</div>
                  <div className="text-2xl font-bold mb-2">Easy</div>
                  <div className="text-lg">1 Point</div>
                  <div className="text-sm opacity-80 mt-2">Common Pokémon</div>
                </button>

                <button
                  onClick={() => isCurrentNoob && selectDifficulty('medium')}
                  disabled={!isCurrentNoob}
                  className={`rounded-2xl p-8 transition-all shadow-lg ${
                    isCurrentNoob 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white hover:scale-105 cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">🤔</div>
                  <div className="text-2xl font-bold mb-2">Medium</div>
                  <div className="text-lg">2 Points</div>
                  <div className="text-sm opacity-80 mt-2">Moderately Known</div>
                </button>

                <button
                  onClick={() => isCurrentNoob && selectDifficulty('hard')}
                  disabled={!isCurrentNoob}
                  className={`rounded-2xl p-8 transition-all shadow-lg ${
                    isCurrentNoob 
                      ? 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 cursor-pointer' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                  }`}
                >
                  <div className="text-4xl mb-2">😰</div>
                  <div className="text-2xl font-bold mb-2">Hard</div>
                  <div className="text-lg">3 Points</div>
                  <div className="text-sm opacity-80 mt-2">Obscure Pokémon</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (gameState === 'describing' || gameState === 'drawing') {
      // Safety check - ensure currentPokemon exists
      if (!currentPokemon) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">Loading Pokémon...</div>
            </div>
          </div>
        );
      }

      // Check if current player is the Noob (describer/drawer)
      const myPlayer = players.find(p => p.id === myPlayerId);
      const isNoob = myPlayer?.role === 'noob' && myPlayer?.team === currentTeamIndex;
      
      // Check if player can guess (must be Pro on the CURRENT team)
      const canGuess = myPlayer?.role === 'pro' && myPlayer?.team === currentTeamIndex;
      
      // Get the player's own team info for display
      const myTeam = myPlayer?.team !== null ? teams[myPlayer.team] : null;

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative overflow-hidden">
        <AnimatedPokemonBackground />
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              {/* Only show Pokémon to the Noob */}
              {isNoob && (
                <div className="col-span-1 bg-white rounded-3xl shadow-2xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-xl font-bold text-purple-600 mb-2">NOOB VIEW ONLY</div>
                    <div className="text-lg text-gray-600">{currentTeam.noob}</div>
                  </div>

                  {/* Show Pokemon reference */}
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 mb-4">
                    <div className="text-sm font-bold text-purple-700 mb-2 text-center">Reference:</div>
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.sprite}.png`}
                      alt="Pokemon"
                      className="w-full h-auto"
                    />
                    <div className="text-center mt-2 text-xl font-bold text-gray-800">
                      {currentPokemon.name}
                    </div>
                  </div>

                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                    <div className="font-bold text-red-700 mb-2">Remember:</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {gameMode === 'drawing' ? (
                        <>
                          <li>✓ Draw the Pokémon's shape and features</li>
                          <li>✗ Don't write the name!</li>
                          <li>✗ Don't write letters or numbers</li>
                        </>
                      ) : (
                        <>
                          <li>✓ Describe colors, shapes, vibes</li>
                          <li>✗ Don't say the name!</li>
                          <li>✗ Don't spell letters</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <div className={isNoob ? "col-span-2 space-y-6" : "col-span-3 space-y-6"}>
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <div className="text-3xl font-bold" style={{ color: myTeam?.color || currentTeam.color }}>
                        {myTeam?.name || 'Spectator'}
                      </div>
                      <div className="text-gray-600">
                        {myPlayer?.role === 'pro' ? `Pros: ${myTeam?.pros.join(', ')}` : `You are the Noob`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Round {roundNumber}/{totalRounds}</div>
                      <div className="text-4xl font-bold">{myTeam?.score || 0} pts</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 mb-6">
                    <div className="text-center">
                      <div className="text-white text-6xl font-bold mb-2">{timeLeft}s</div>
                      <div className="text-white text-xl">
                        {currentTeam.noob} is {gameMode === 'drawing' ? 'drawing' : 'describing'}...
                      </div>
                    </div>
                  </div>

                  {gameMode === 'drawing' && (
                    <div className="mb-6">
                      {isNoob ? (
                        <DrawingCanvas 
                          pokemonName={currentPokemon.name}
                          onDrawingUpdate={(imageData) => syncDrawing(imageData)}
                        />
                      ) : (
                        <div className="bg-white rounded-xl p-4">
                          <div className="text-center mb-2 font-bold text-purple-700 text-xl">🎨 Live Drawing:</div>
                          {drawingData ? (
                            <img src={drawingData} alt="Drawing" className="w-full rounded-lg border-4 border-purple-400 bg-white" />
                          ) : (
                            <div className="w-full h-96 rounded-lg border-4 border-gray-300 bg-white flex items-center justify-center">
                              <div className="text-gray-400 text-xl">Waiting for drawing to start...</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {canGuess ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={guessInput}
                        onChange={(e) => setGuessInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGuess(currentTeamIndex)}
                        placeholder="Type your guess..."
                        className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleGuess(currentTeamIndex)}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold py-4 rounded-xl hover:scale-105 transition-transform shadow-lg"
                      >
                        Submit Guess
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-6 text-center">
                      <div className="text-gray-600 text-lg">
                        {isNoob ? (
                          <>
                            <div className="text-2xl mb-2">🎨</div>
                            <div>You are {gameMode === 'drawing' ? 'drawing' : 'describing'}!</div>
                            <div className="text-sm mt-2">Wait for your team's Pros to guess</div>
                          </>
                        ) : (
                          <>
                            <div className="text-2xl mb-2">⏳</div>
                            <div>You cannot guess this round</div>
                            <div className="text-sm mt-2">Only {currentTeam.name}'s Pros can guess</div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="font-bold text-gray-800 mb-3">Scoreboard</div>
                  <div className="grid grid-cols-4 gap-4">
                    {teams.map(team => (
                      <div key={team.id} className="text-center p-3 rounded-xl" style={{ backgroundColor: `${team.color}20` }}>
                        <div className="font-bold" style={{ color: team.color }}>{team.name}</div>
                        <div className="text-2xl font-bold">{team.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (gameState === 'steal') {
      // Safety check
      if (!currentPokemon) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">Loading...</div>
            </div>
          </div>
        );
      }

      const myPlayer = players.find(p => p.id === myPlayerId);
      // Can steal if: Pro AND not on the current team
      const canSteal = myPlayer?.role === 'pro' && myPlayer?.team !== currentTeamIndex;
      const myTeam = myPlayer?.team !== null ? teams[myPlayer.team] : null;

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">⚡</div>
                <div className="text-4xl font-bold text-red-600 mb-2">STEAL PHASE!</div>
                <div className="text-2xl text-gray-600">
                  {canSteal ? 'Steal the points for your team!' : 'Other teams can steal the points!'}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-white text-6xl font-bold">{timeLeft}s</div>
                </div>
              </div>

              {canSteal ? (
                <>
                  <div className="mb-6">
                    <div className="text-lg font-bold text-gray-800 mb-3">Select your team:</div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {teams.filter((_, i) => i !== currentTeamIndex).map((team) => (
                        <button
                          key={team.id}
                          onClick={() => setStealTeamIndex(team.id)}
                          className={`p-4 rounded-xl font-bold transition-all ${
                            stealTeamIndex === team.id
                              ? 'ring-4 ring-purple-500 scale-105'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: team.color, color: 'white' }}
                        >
                          {team.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={guessInput}
                      onChange={(e) => setGuessInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && stealTeamIndex !== null && handleGuess(stealTeamIndex)}
                      placeholder="Type your guess..."
                      className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-xl focus:outline-none focus:border-red-500"
                      disabled={stealTeamIndex === null}
                    />
                    <button
                      onClick={() => stealTeamIndex !== null && handleGuess(stealTeamIndex)}
                      disabled={stealTeamIndex === null}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-xl font-bold py-4 rounded-xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Steal Points!
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-8 text-center">
                  <div className="text-gray-600 text-lg">
                    {myPlayer?.role === 'noob' ? (
                      <>
                        <div className="text-3xl mb-3">🎨</div>
                        <div className="font-bold mb-2">Noobs Cannot Steal</div>
                        <div className="text-sm">Wait for the next round</div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl mb-3">⏳</div>
                        <div className="font-bold mb-2">You Cannot Steal This Round</div>
                        <div className="text-sm">Only Pros from other teams can steal</div>
                        <div className="text-sm mt-1">(You're on {currentTeam.name})</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="font-bold text-gray-800 mb-3">Scoreboard</div>
                <div className="grid grid-cols-4 gap-4">
                  {teams.map(team => (
                    <div key={team.id} className="text-center p-3 rounded-xl" style={{ backgroundColor: `${team.color}20` }}>
                      <div className="font-bold" style={{ color: team.color }}>{team.name}</div>
                      <div className="text-2xl font-bold">{team.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (gameState === 'round-end') {
      // Safety check
      if (!currentPokemon) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-4">Loading...</div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-4xl font-bold text-green-600 mb-4">Round Complete!</div>
                <div className="text-2xl text-gray-600 mb-4">The Pokémon was:</div>
                <div className="text-5xl font-bold text-purple-600">{currentPokemon.name}</div>
              </div>

              <div className="mb-8">
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.sprite}.png`}
                  alt={currentPokemon.name}
                  className="w-64 h-64 mx-auto"
                />
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="font-bold text-xl text-gray-800 mb-4 text-center">Current Scores</div>
                <div className="grid grid-cols-4 gap-4">
                  {teams.map(team => (
                    <div key={team.id} className="text-center p-4 rounded-xl" style={{ backgroundColor: `${team.color}20` }}>
                      <div className="font-bold text-lg" style={{ color: team.color }}>{team.name}</div>
                      <div className="text-4xl font-bold">{team.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={nextRound}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold py-6 rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                {roundNumber >= totalRounds ? 'See Final Results' : 'Next Round'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (gameState === 'game-over') {
      const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
      const winner = sortedTeams[0];

      return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="text-7xl mb-4">🏆</div>
                <div className="text-5xl font-bold text-yellow-600 mb-4">Game Over!</div>
                <div className="text-3xl font-bold mb-2" style={{ color: winner.color }}>
                  {winner.name} Wins!
                </div>
                <div className="text-6xl font-bold text-purple-600">{winner.score} Points</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
                <div className="font-bold text-2xl text-gray-800 mb-4 text-center">Final Standings</div>
                <div className="space-y-3">
                  {sortedTeams.map((team, index) => (
                    <div key={team.id} className="flex items-center justify-between p-4 rounded-xl bg-white shadow">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-gray-400">#{index + 1}</div>
                        <div>
                          <div className="font-bold text-xl" style={{ color: team.color }}>{team.name}</div>
                          <div className="text-sm text-gray-500">{team.noob} & {team.pros.join(', ')}</div>
                        </div>
                      </div>
                      <div className="text-4xl font-bold" style={{ color: team.color }}>{team.score}</div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold py-6 rounded-xl hover:scale-105 transition-transform shadow-lg"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Catch-all for unexpected game states
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="text-4xl font-bold text-blue-600 mb-4">Loading...</div>
          <div className="text-xl text-gray-600">Game state: {gameState}</div>
        </div>
      </div>
    );
  }

  return null;
}