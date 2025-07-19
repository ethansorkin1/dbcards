import { useState } from 'react'
import { FaArrowUp, FaArrowDown, FaTrash } from 'react-icons/fa';
import './App.css'

function App() {
  // State for friends, foes, and input fields
  const [friends, setFriends] = useState([]);
  const [foes, setFoes] = useState([]);
  const [friendInput, setFriendInput] = useState("");
  const [foeInput, setFoeInput] = useState("");
  const [dealtCards, setDealtCards] = useState([]);
  const [currentCardIdx, setCurrentCardIdx] = useState(null);
  const [swapValue, setSwapValue] = useState("");
  const [swapError, setSwapError] = useState("");

  // Add friend
  const addFriend = () => {
    if (friendInput.trim()) {
      setFriends([...friends, friendInput.trim()]);
      setFriendInput("");
    }
  };
  const handleFriendKeyDown = (e) => {
    if (e.key === 'Enter') addFriend();
  };

  // Add foe
  const addFoe = () => {
    if (foeInput.trim()) {
      setFoes([...foes, foeInput.trim()]);
      setFoeInput("");
    }
  };
  const handleFoeKeyDown = (e) => {
    if (e.key === 'Enter') addFoe();
  };

  // Remove item from list
  const removeItem = (list, setList, idx) => {
    setList(list.filter((_, i) => i !== idx));
  };

  // Move item up
  const moveUp = (list, setList, idx) => {
    if (idx === 0) return;
    const newList = [...list];
    [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
    setList(newList);
  };

  // Move item down
  const moveDown = (list, setList, idx) => {
    if (idx === list.length - 1) return;
    const newList = [...list];
    [newList[idx + 1], newList[idx]] = [newList[idx], newList[idx + 1]];
    setList(newList);
  };

  // Clear list
  const clearList = (setList) => {
    setList([]);
  };

  // Deal cards
  const dealCards = () => {
    const allNames = [...friends, ...foes];
    let deck = Array.from({ length: 10 }, (_, i) => i + 1);
    deck = deck.sort(() => Math.random() - 0.5); // Shuffle
    const cards = allNames.map((_, idx) => deck[idx % deck.length]);
    setDealtCards(cards);
    // Set current card to the lowest card
    if (cards.length > 0) {
      const minCard = Math.min(...cards);
      setCurrentCardIdx(cards.indexOf(minCard));
    } else {
      setCurrentCardIdx(null);
    }
  };

  // Next card indicator
  const nextCard = () => {
    if (!dealtCards.length || currentCardIdx === null) return;
    const sortedCards = [...dealtCards].sort((a, b) => a - b);
    const currentCard = dealtCards[currentCardIdx];
    const currentIdxInSorted = sortedCards.indexOf(currentCard);
    if (currentIdxInSorted < sortedCards.length - 1) {
      const nextCardValue = sortedCards[currentIdxInSorted + 1];
      setCurrentCardIdx(dealtCards.indexOf(nextCardValue));
    }
  };

  // Swap logic
  const handleSwap = () => {
    setSwapError("");
    if (!dealtCards.length || currentCardIdx === null) return;
    const currentCard = dealtCards[currentCardIdx];
    const swapNum = parseInt(swapValue, 10);
    if (isNaN(swapNum)) {
      setSwapError("Please enter a valid number.");
      return;
    }
    if (swapNum <= currentCard) {
      setSwapError("Number must be higher than the current card.");
      return;
    }
    const swapIdx = dealtCards.indexOf(swapNum);
    if (swapIdx === -1) {
      setSwapError("Number not found in the table.");
      return;
    }
    // Swap the cards
    const newCards = [...dealtCards];
    newCards[currentCardIdx] = swapNum;
    newCards[swapIdx] = currentCard;
    setDealtCards(newCards);
    setCurrentCardIdx(swapIdx); // Move indicator to swapped card
    setSwapValue("");
  };

  // Table rendering
  const allNames = [...friends, ...foes];
  const friendCount = friends.length;
  const foeCount = foes.length;
  const tableHasData = dealtCards.length > 0;

  // Helper to render a row with black column between friends and foes
  function renderRow(arr, renderCell) {
    const row = [];
    for (let i = 0; i < arr.length; i++) {
      row.push(renderCell(arr[i], i));
      if (i === friendCount - 1 && foeCount > 0) {
        row.push(<td key="black-col" className="black-col"></td>);
      }
    }
    // If no foes, don't add black column
    if (friendCount === arr.length) {
      return row;
    }
    return row;
  }

  return (
    <div className="App">
          <h1>Initiative Dealer</h1>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div>
          <h2>Friends</h2>
          <input
            value={friendInput}
            onChange={e => setFriendInput(e.target.value)}
            onKeyDown={handleFriendKeyDown}
            placeholder="Add friend name"
          />
          <button onClick={addFriend}>Add Friend</button>
          <button onClick={() => clearList(setFriends)} style={{ marginLeft: '1rem' }}>Clear</button>
          <ul>
            {friends.map((name, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {name}
                <button onClick={() => moveUp(friends, setFriends, idx)} disabled={idx === 0} title="Move Up"><FaArrowUp /></button>
                <button onClick={() => moveDown(friends, setFriends, idx)} disabled={idx === friends.length - 1} title="Move Down"><FaArrowDown /></button>
                <button onClick={() => removeItem(friends, setFriends, idx)} title="Remove"><FaTrash /></button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ minWidth: '2rem' }}></div> {/* Empty column */}
        <div>
          <h2>Foes</h2>
          <input
            value={foeInput}
            onChange={e => setFoeInput(e.target.value)}
            onKeyDown={handleFoeKeyDown}
            placeholder="Add foe name"
          />
          <button onClick={addFoe}>Add Foe</button>
          <button onClick={() => clearList(setFoes)} style={{ marginLeft: '1rem' }}>Clear</button>
          <ul>
            {foes.map((name, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {name}
                <button onClick={() => moveUp(foes, setFoes, idx)} disabled={idx === 0} title="Move Up"><FaArrowUp /></button>
                <button onClick={() => moveDown(foes, setFoes, idx)} disabled={idx === foes.length - 1} title="Move Down"><FaArrowDown /></button>
                <button onClick={() => removeItem(foes, setFoes, idx)} title="Remove"><FaTrash /></button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button style={{ marginTop: '2rem' }} onClick={dealCards} disabled={allNames.length === 0}>
        Deal
      </button>
      {tableHasData && (
        <div>
          <table className="card-table" style={{ marginTop: '2rem', minWidth: '300px', textAlign: 'center', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                {renderRow(allNames, (name, idx) => (
                  <td key={idx}><b>{name}</b></td>
                ))}
              </tr>
              <tr>
                {renderRow(dealtCards, (card, idx) => (
                  <td key={idx}>{card}</td>
                ))}
              </tr>
              <tr>
                {renderRow(dealtCards, (card, idx) => (
                  <td key={idx} style={{ fontWeight: idx === currentCardIdx ? 'bold' : 'normal' }}>
                    {idx === currentCardIdx ? 'Current' : ''}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <button onClick={nextCard} disabled={currentCardIdx === null || dealtCards.length < 2}>
              Next
            </button>
            <input
              type="number"
              value={swapValue}
              onChange={e => setSwapValue(e.target.value)}
              placeholder="swap to"
              style={{ width: '80px' }}
            />
            <button onClick={handleSwap} disabled={currentCardIdx === null || !swapValue}>
              Swap
            </button>
          </div>
          {swapError && <div style={{ color: 'red', marginTop: '0.5rem' }}>{swapError}</div>}
        </div>
      )}
    </div>
  );
}

export default App
