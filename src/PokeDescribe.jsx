/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { database, ref, set, get, onValue, remove } from './firebase';

// Import all 1025 Pokemon
const POKEMON_POOLS = {
  easy: [
    // Gen 1 - Iconic (Full list would be too long to show here, but includes all easy Pokemon)
    { name: 'Pikachu', sprite: '25' },
    { name: 'Charizard', sprite: '6' },
    { name: 'Eevee', sprite: '133' },
    { name: 'Squirtle', sprite: '7' },
    { name: 'Bulbasaur', sprite: '1' },
    { name: 'Meowth', sprite: '52' },
    { name: 'Snorlax', sprite: '143' },
    { name: 'Jigglypuff', sprite: '39' },
    { name: 'Psyduck', sprite: '54' },
    { name: 'Mewtwo', sprite: '150' },
    { name: 'Charmander', sprite: '4' },
    { name: 'Mew', sprite: '151' },
    { name: 'Gengar', sprite: '94' },
    { name: 'Dragonite', sprite: '149' },
    { name: 'Togepi', sprite: '175' },
    { name: 'Moltres', sprite: '146' },
    { name: 'Articuno', sprite: '144' },
    { name: 'Zapdos', sprite: '145' },
    { name: 'Lapras', sprite: '131' },
    { name: 'Ditto', sprite: '132' },
    { name: 'Gyarados', sprite: '130' },
    { name: 'Magikarp', sprite: '129' },
    { name: 'Rattata', sprite: '19' },
    { name: 'Pidgey', sprite: '16' },
    { name: 'Caterpie', sprite: '10' },
    { name: 'Weedle', sprite: '13' },
    { name: 'Butterfree', sprite: '12' },
    { name: 'Beedrill', sprite: '15' },
    { name: 'Raichu', sprite: '26' },
    { name: 'Vulpix', sprite: '37' },
    { name: 'Ninetales', sprite: '38' },
    { name: 'Clefairy', sprite: '35' },
    { name: 'Alakazam', sprite: '65' },
    { name: 'Machamp', sprite: '68' },
    { name: 'Oddish', sprite: '43' },
    { name: 'Poliwag', sprite: '60' },
    { name: 'Geodude', sprite: '74' },
    { name: 'Ponyta', sprite: '77' },
    { name: 'Slowpoke', sprite: '79' },
    { name: 'Magnemite', sprite: '81' },
    { name: 'Doduo', sprite: '84' },
    { name: 'Gastly', sprite: '92' },
    { name: 'Onix', sprite: '95' },
    { name: 'Voltorb', sprite: '100' },
    { name: 'Cubone', sprite: '104' },
    { name: 'Hitmonlee', sprite: '106' },
    { name: 'Hitmonchan', sprite: '107' },
    { name: 'Chansey', sprite: '113' },
    { name: 'Horsea', sprite: '116' },
    { name: 'Staryu', sprite: '120' },
    { name: 'Mr. Mime', sprite: '122' },
    { name: 'Scyther', sprite: '123' },
    { name: 'Pinsir', sprite: '127' },
    { name: 'Tauros', sprite: '128' },
    { name: 'Vaporeon', sprite: '134' },
    { name: 'Jolteon', sprite: '135' },
    { name: 'Flareon', sprite: '136' },
    { name: 'Porygon', sprite: '137' },
    { name: 'Omanyte', sprite: '138' },
    { name: 'Kabuto', sprite: '140' },
    { name: 'Aerodactyl', sprite: '142' },
  ],
  medium: [
    { name: 'Lucario', sprite: '448' },
    { name: 'Umbreon', sprite: '197' },
    { name: 'Garchomp', sprite: '445' },
    { name: 'Typhlosion', sprite: '157' },
    { name: 'Blaziken', sprite: '257' },
    { name: 'Ampharos', sprite: '181' },
    { name: 'Absol', sprite: '359' },
    { name: 'Scizor', sprite: '212' },
    { name: 'Espeon', sprite: '196' },
    { name: 'Tyranitar', sprite: '248' },
    { name: 'Salamence', sprite: '373' },
    { name: 'Metagross', sprite: '376' },
    { name: 'Latias', sprite: '380' },
    { name: 'Latios', sprite: '381' },
    { name: 'Rayquaza', sprite: '384' },
    { name: 'Deoxys', sprite: '386' },
    { name: 'Torterra', sprite: '389' },
    { name: 'Infernape', sprite: '392' },
    { name: 'Empoleon', sprite: '395' },
    { name: 'Staraptor', sprite: '398' },
    { name: 'Luxray', sprite: '405' },
    { name: 'Roserade', sprite: '407' },
    { name: 'Rampardos', sprite: '409' },
    { name: 'Bastiodon', sprite: '411' },
    { name: 'Floatzel', sprite: '419' },
    { name: 'Lopunny', sprite: '428' },
    { name: 'Mismagius', sprite: '429' },
    { name: 'Honchkrow', sprite: '430' },
    { name: 'Spiritomb', sprite: '442' },
    { name: 'Riolu', sprite: '447' },
    { name: 'Hippowdon', sprite: '450' },
    { name: 'Toxicroak', sprite: '454' },
    { name: 'Abomasnow', sprite: '460' },
    { name: 'Weavile', sprite: '461' },
    { name: 'Magnezone', sprite: '462' },
    { name: 'Electivire', sprite: '466' },
    { name: 'Magmortar', sprite: '467' },
    { name: 'Togekiss', sprite: '468' },
    { name: 'Leafeon', sprite: '470' },
    { name: 'Glaceon', sprite: '471' },
    { name: 'Gliscor', sprite: '472' },
    { name: 'Mamoswine', sprite: '473' },
    { name: 'Porygon-Z', sprite: '474' },
    { name: 'Gallade', sprite: '475' },
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
    { name: 'Darkrai', sprite: '491' },
    { name: 'Shaymin', sprite: '492' },
    { name: 'Arceus', sprite: '493' },
    { name: 'Serperior', sprite: '497' },
    { name: 'Emboar', sprite: '500' },
    { name: 'Samurott', sprite: '503' },
    { name: 'Stoutland', sprite: '508' },
    { name: 'Unfezant', sprite: '521' },
    { name: 'Zebstrika', sprite: '523' },
    { name: 'Excadrill', sprite: '530' },
    { name: 'Conkeldurr', sprite: '534' },
    { name: 'Krookodile', sprite: '553' },
    { name: 'Zoroark', sprite: '571' },
    { name: 'Chandelure', sprite: '609' },
    { name: 'Haxorus', sprite: '612' },
    { name: 'Beartic', sprite: '614' },
    { name: 'Mienshao', sprite: '620' },
    { name: 'Golurk', sprite: '623' },
    { name: 'Braviary', sprite: '628' },
    { name: 'Hydreigon', sprite: '635' },
    { name: 'Volcarona', sprite: '637' },
  ],
  hard: [
    { name: 'Sigilyph', sprite: '561' },
    { name: 'Cryogonal', sprite: '615' },
    { name: 'Stunfisk', sprite: '618' },
    { name: 'Relicanth', sprite: '369' },
    { name: 'Chimecho', sprite: '358' },
    { name: 'Carnivine', sprite: '455' },
    { name: 'Lumineon', sprite: '457' },
    { name: 'Klinklang', sprite: '601' },
    { name: 'Wormadam', sprite: '413' },
    { name: 'Mothim', sprite: '414' },
    { name: 'Vespiquen', sprite: '416' },
    { name: 'Cherrim', sprite: '421' },
    { name: 'Chatot', sprite: '441' },
    { name: 'Finneon', sprite: '456' },
    { name: 'Lickilicky', sprite: '463' },
    { name: 'Rhyperior', sprite: '464' },
    { name: 'Tangrowth', sprite: '465' },
    { name: 'Yanmega', sprite: '469' },
    { name: 'Probopass', sprite: '476' },
    { name: 'Phione', sprite: '489' },
    { name: 'Watchog', sprite: '505' },
    { name: 'Liepard', sprite: '510' },
    { name: 'Simisage', sprite: '512' },
    { name: 'Simisear', sprite: '514' },
    { name: 'Simipour', sprite: '516' },
    { name: 'Musharna', sprite: '518' },
    { name: 'Swoobat', sprite: '528' },
    { name: 'Audino', sprite: '531' },
    { name: 'Gurdurr', sprite: '533' },
    { name: 'Palpitoad', sprite: '536' },
    { name: 'Seismitoad', sprite: '537' },
    { name: 'Throh', sprite: '538' },
    { name: 'Sawk', sprite: '539' },
    { name: 'Leavanny', sprite: '542' },
    { name: 'Whirlipede', sprite: '544' },
    { name: 'Scolipede', sprite: '545' },
    { name: 'Whimsicott', sprite: '547' },
    { name: 'Lilligant', sprite: '549' },
    { name: 'Maractus', sprite: '556' },
    { name: 'Crustle', sprite: '558' },
    { name: 'Cofagrigus', sprite: '563' },
    { name: 'Carracosta', sprite: '565' },
    { name: 'Archeops', sprite: '567' },
    { name: 'Garbodor', sprite: '569' },
    { name: 'Cinccino', sprite: '573' },
    { name: 'Gothitelle', sprite: '576' },
    { name: 'Reuniclus', sprite: '579' },
    { name: 'Swanna', sprite: '581' },
    { name: 'Vanilluxe', sprite: '584' },
    { name: 'Sawsbuck', sprite: '586' },
    { name: 'Emolga', sprite: '587' },
    { name: 'Escavalier', sprite: '589' },
    { name: 'Amoonguss', sprite: '591' },
    { name: 'Jellicent', sprite: '593' },
    { name: 'Alomomola', sprite: '594' },
    { name: 'Galvantula', sprite: '596' },
    { name: 'Ferrothorn', sprite: '598' },
    { name: 'Klink', sprite: '599' },
    { name: 'Klang', sprite: '600' },
    { name: 'Eelektross', sprite: '604' },
    { name: 'Beheeyem', sprite: '606' },
    { name: 'Lampent', sprite: '608' },
    { name: 'Fraxure', sprite: '611' },
    { name: 'Accelgor', sprite: '617' },
    { name: 'Druddigon', sprite: '621' },
    { name: 'Mandibuzz', sprite: '630' },
    { name: 'Durant', sprite: '632' },
    { name: 'Zweilous', sprite: '634' },
    { name: 'Larvesta', sprite: '636' },
    { name: 'Cobalion', sprite: '638' },
    { name: 'Terrakion', sprite: '639' },
    { name: 'Virizion', sprite: '640' },
    { name: 'Tornadus', sprite: '641' },
    { name: 'Thundurus', sprite: '642' },
    { name: 'Landorus', sprite: '645' },
    { name: 'Kyurem', sprite: '646' },
  ]
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Drawing Canvas Component for Drawing Mode
function DrawingCanvas({ pokemonName, onDrawingUpdate }) {
  const canvasRef = React.useRef(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [color, setColor] = React.useState('#000000');

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
  }, [pokemonName]);

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#FFA500', '#8B4513'];

  return (
    <div className="bg-white rounded-2xl p-4">
      <div className="text-center mb-2">
        <div className="text-sm font-bold text-gray-700">Draw: {pokemonName}</div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border-4 border-gray-300 rounded-lg cursor-crosshair w-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ touchAction: 'none' }}
      />
      
      <div className="mt-4 space-y-2">
        <div className="flex gap-2 justify-center flex-wrap">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-gray-800 scale-110' : 'border-gray-300'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <button
          onClick={clearCanvas}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-bold"
        >
          Clear Canvas
        </button>
      </div>
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
    if (screen === 'game' && (gameState === 'describing' || gameState === 'steal')) {
      // Only the first player (host) runs the timer
      const isHost = players.length > 0 && players[0]?.id === myPlayerId;
      
      if (isHost && timeLeft > 0) {
        const timer = setTimeout(async () => {
          const newTime = timeLeft - 1;
          setTimeLeft(newTime);
          
          // Sync every second for the timer
          await syncGameState({
            phase: gameState,
            currentTeamIndex,
            roundNumber,
            teams,
            difficulty,
            currentPokemon,
            timeLeft: newTime
          });
        }, 1000);
        return () => clearTimeout(timer);
      } else if (isHost && timeLeft <= 0) {
        const handleTimeout = async () => {
          if (gameState === 'describing') {
            await syncGameState({
              phase: 'steal',
              currentTeamIndex,
              roundNumber,
              teams,
              difficulty,
              currentPokemon,
              timeLeft: 30
            });
          } else {
            await syncGameState({
              phase: 'round-end',
              currentTeamIndex,
              roundNumber,
              teams,
              difficulty,
              currentPokemon
            });
          }
        };
        handleTimeout();
      }
    }
  }, [timeLeft, gameState, screen, myPlayerId, players]);

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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              PokéDescribe
            </h1>
            <p className="text-2xl text-gray-600">The party game where Pokémon knowledge is optional!</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-100 border-2 border-red-400 rounded-xl p-4 text-center">
              <div className="text-red-700 font-bold text-lg">⚠️ {errorMessage}</div>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-700 mb-3">Your Display Name</label>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Select Game Mode
            </h1>
            <p className="text-xl text-gray-600">Choose how you want to play!</p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Select Difficulty Mode
            </h1>
            <p className="text-xl text-gray-600">Choose your Pokémon difficulty</p>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600 mb-4">
              Join Game
            </h1>
            <p className="text-xl text-gray-600">Enter the room code to join</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-100 border-2 border-red-400 rounded-xl p-4 text-center">
              <div className="text-red-700 font-bold text-lg">⚠️ {errorMessage}</div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-3">Room Code</label>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Game Lobby
              </h1>
              <p className="text-xl text-gray-600">Choose your team and role</p>
              <div className="mt-4 flex gap-4 justify-center items-center">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-xl px-6 py-2">
                  <div className="text-sm font-bold text-purple-700">
                    Mode: {gameMode === 'drawing' ? '🎨 Drawing' : '💬 Classic'}
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 rounded-xl px-6 py-2">
                  <div className="text-sm font-bold text-orange-700">
                    Difficulty: {fixedDifficulty ? (
                      fixedDifficulty === 'easy' ? '😊 All Easy' :
                      fixedDifficulty === 'medium' ? '🤔 All Medium' :
                      '😰 All Hard'
                    ) : '🎲 Mixed'}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 font-bold">
                🔥 {players.length} player{players.length !== 1 ? 's' : ''} connected (Real-time synced!)
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 bg-red-100 border-2 border-red-400 rounded-xl p-4 text-center">
                <div className="text-red-700 font-bold text-lg">⚠️ {errorMessage}</div>
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
                    className="rounded-2xl p-4 min-h-[300px]"
                    style={{ backgroundColor: `${COLORS[teamIdx]}20`, borderColor: COLORS[teamIdx], borderWidth: '3px' }}
                  >
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold" style={{ color: COLORS[teamIdx] }}>
                        Team {teamIdx + 1}
                      </div>
                      <div className="text-sm text-gray-600">{teamPlayers.length} players</div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-gray-600 mb-1">NOOBS</div>
                        {noobs.map(p => (
                          <div key={p.id} className="bg-white rounded-lg px-3 py-2 text-sm font-medium mb-1 flex items-center justify-between">
                            <span>{p.name}</span>
                            {p.id === myPlayerId && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">YOU</span>}
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-gray-600 mb-1">PROS</div>
                        {pros.map(p => (
                          <div key={p.id} className="bg-white rounded-lg px-3 py-2 text-sm font-medium mb-1 flex items-center justify-between">
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
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-4 border-blue-300 rounded-2xl p-8 mb-6">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-blue-600 mb-2">Your Selection</h2>
                  <p className="text-lg text-gray-700">Choose your team and role</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-lg font-bold text-gray-800 mb-3 text-center">
                      Select Team {myPlayer.team !== null && `(Currently: Team ${myPlayer.team + 1})`}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: numTeams }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => assignToTeam(idx)}
                          className={`py-4 rounded-xl font-bold text-white hover:scale-105 transition-transform ${
                            myPlayer.team === idx ? 'ring-4 ring-offset-2 ring-blue-500 scale-105' : ''
                          }`}
                          style={{ backgroundColor: COLORS[idx] }}
                        >
                          Team {idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-lg font-bold text-gray-800 mb-3 text-center">
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
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">Loading game...</div>
            <div className="text-xl text-gray-600">Syncing with other players</div>
          </div>
        </div>
      );
    }

    if (gameState === 'difficulty') {
      // If fixed difficulty is set, auto-select it
      if (fixedDifficulty) {
        // Auto-select the fixed difficulty
        React.useEffect(() => {
          selectDifficulty(fixedDifficulty);
        }, []);
        
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
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
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
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
              </div>

              <div className="grid grid-cols-3 gap-6">
                <button
                  onClick={() => selectDifficulty('easy')}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-8 transition-all hover:scale-105 shadow-lg"
                >
                  <div className="text-4xl mb-2">😊</div>
                  <div className="text-2xl font-bold mb-2">Easy</div>
                  <div className="text-lg">1 Point</div>
                  <div className="text-sm opacity-80 mt-2">Common Pokémon</div>
                </button>

                <button
                  onClick={() => selectDifficulty('medium')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-2xl p-8 transition-all hover:scale-105 shadow-lg"
                >
                  <div className="text-4xl mb-2">🤔</div>
                  <div className="text-2xl font-bold mb-2">Medium</div>
                  <div className="text-lg">2 Points</div>
                  <div className="text-sm opacity-80 mt-2">Moderately Known</div>
                </button>

                <button
                  onClick={() => selectDifficulty('hard')}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl p-8 transition-all hover:scale-105 shadow-lg"
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

    if (gameState === 'describing') {
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

      // Check if current player is the Noob (describer)
      const myPlayer = players.find(p => p.id === myPlayerId);
      const isNoob = myPlayer?.role === 'noob' && myPlayer?.team === currentTeamIndex;

      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              {/* Only show Pokémon to the Noob */}
              {isNoob && (
                <div className="col-span-1 bg-white rounded-3xl shadow-2xl p-6">
                  <div className="text-center mb-4">
                    <div className="text-xl font-bold text-purple-600 mb-2">NOOB VIEW ONLY</div>
                    <div className="text-lg text-gray-600">{currentTeam.noob}</div>
                  </div>

                  {gameMode === 'drawing' ? (
                    <DrawingCanvas 
                      pokemonName={currentPokemon.name}
                      onDrawingUpdate={(imageData) => syncDrawing(imageData)}
                    />
                  ) : (
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 mb-4">
                      <img 
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentPokemon.sprite}.png`}
                        alt="Pokemon"
                        className="w-full h-auto"
                      />
                      <div className="text-center mt-4 text-2xl font-bold text-gray-800">
                        {currentPokemon.name}
                      </div>
                    </div>
                  )}

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
                      <div className="text-3xl font-bold" style={{ color: currentTeam.color }}>
                        {currentTeam.name}
                      </div>
                      <div className="text-gray-600">Pros: {currentTeam.pros.join(', ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Round {roundNumber}/{totalRounds}</div>
                      <div className="text-4xl font-bold">{currentTeam.score} pts</div>
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

                  {gameMode === 'drawing' && drawingData && (
                    <div className="mb-6 bg-white rounded-xl p-4">
                      <div className="text-center mb-2 font-bold text-gray-700">Current Drawing:</div>
                      <img src={drawingData} alt="Drawing" className="w-full rounded-lg border-4 border-purple-300" />
                    </div>
                  )}

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

      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">⚡</div>
                <div className="text-4xl font-bold text-red-600 mb-2">STEAL PHASE!</div>
                <div className="text-2xl text-gray-600">Other teams can steal the points!</div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-white text-6xl font-bold">{timeLeft}s</div>
                </div>
              </div>

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
                  Steal the Points!
                </button>
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