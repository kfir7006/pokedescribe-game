
import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { database, ref, set, get, onValue, remove } from './firebase';

const POKEMON_POOLS = {
  easy: [
    { name: 'Pikachu', sprite: '025' },
    { name: 'Charizard', sprite: '006' },
    { name: 'Eevee', sprite: '133' },
    { name: 'Squirtle', sprite: '007' },
    { name: 'Bulbasaur', sprite: '001' },
    { name: 'Meowth', sprite: '052' },
    { name: 'Snorlax', sprite: '143' },
    { name: 'Jigglypuff', sprite: '039' },
    { name: 'Psyduck', sprite: '054' },
    { name: 'Mewtwo', sprite: '150' },
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
  ]
};

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export default function PokeDescribe() {
  const [screen, setScreen] = useState('main-menu');
  const [gameState, setGameState] = useState('difficulty');
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
    
   // Game State Sync Functions
  const syncGameState = async (state) => {
    if (!database || !roomCode) return;
    try {
      await set(ref(database, `rooms/${roomCode}/gameState`), state);
    } catch (error) {
      console.error('Sync game state error:', error);
    }
  };

  const loadGameState = () => {
    if (!database || !roomCode) return;
    const gameStateRef = ref(database, `rooms/${roomCode}/gameState`);
    onValue(gameStateRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data.phase);
        setCurrentTeamIndex(data.currentTeamIndex || 0);
        setCurrentPokemon(data.currentPokemon);
        setDifficulty(data.difficulty);
        setTimeLeft(data.timeLeft || 60);
        setRoundNumber(data.roundNumber || 1);
        setTeams(data.teams || teams);
      }
    });
  };

  // Listen for game state updates
  useEffect(() => {
    if (screen === 'game' && roomCode) {
      loadGameState();
    }
  }, [screen, roomCode] 
    
    
    try {
      const playerRef = ref(database, `rooms/${roomCode}/players/${myPlayerId}`);
      const snapshot = await get(playerRef);
      const playerData = snapshot.val();
      
      await set(playerRef, { ...playerData, role });
    } catch (error) {
      console.error('Set role error:', error);
    }
  };

  const startGame = () => {
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

    setTeams(newTeams);
    setScreen('game');
setGameState('difficulty');
  };

  useEffect(() => {
    if (screen === 'game' && (gameState === 'describing' || gameState === 'steal')) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        if (gameState === 'describing') {
          setGameState('steal');
          setTimeLeft(30);
        } else {
          setGameState('round-end');
        }
      }
    }
  }, [timeLeft, gameState, screen]);

  const selectDifficulty = (diff) => {
    setDifficulty(diff);
    const pool = POKEMON_POOLS[diff];
    const pokemon = pool[Math.floor(Math.random() * pool.length)];
    setCurrentPokemon(pokemon);
    setGameState('describing');
    setTimeLeft(60);
  };

  const handleGuess = (teamIndex) => {
    const guess = guessInput.trim().toLowerCase();
    const correct = currentPokemon.name.toLowerCase();
    
    if (guess === correct) {
      const points = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3;
      setTeams(teams.map((team, i) => 
        i === teamIndex ? { ...team, score: team.score + points } : team
      ));
      setGameState('round-end');
      setGuessInput('');
    } else {
      setGuessInput('');
    }
  };

  const nextRound = () => {
    if (roundNumber >= totalRounds) {
      setGameState('game-over');
    } else {
      setRoundNumber(roundNumber + 1);
      setCurrentTeamIndex((currentTeamIndex + 1) % teams.length);
      setDifficulty(null);
      setCurrentPokemon(null);
      setGameState('difficulty');
      setStealTeamIndex(null);
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
              onClick={createGame}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl font-bold py-8 rounded-2xl hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Game'}
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
// GAME SCREENS - Add this section before "return null;"
  
  if (screen === 'game') {
    const currentTeam = teams[currentTeamIndex];

    // Difficulty Selection
    if (gameState === 'difficulty') {
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

    // Describing Phase - NEXT SCREEN
    if (gameState === 'describing') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              {/* Noob View */}
              <div className="col-span-1 bg-white rounded-3xl shadow-2xl p-6">
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-purple-600 mb-2">NOOB VIEW ONLY</div>
                  <div className="text-lg text-gray-600">{currentTeam.noob}</div>
                </div>

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

                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
                  <div className="font-bold text-red-700 mb-2">Remember:</div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>✓ Describe colors, shapes, vibes</li>
                    <li>✗ Don't say the name!</li>
                    <li>✗ Don't spell letters</li>
                  </ul>
                </div>
              </div>

              {/* Game View */}
              <div className="col-span-2 space-y-6">
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
                        {currentTeam.noob} is describing...
                      </div>
                    </div>
                  </div>

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

    // Steal Phase
    if (gameState === 'steal') {
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

    // Round End
    if (gameState === 'round-end') {
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

    // Game Over
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

  return null;
}

}