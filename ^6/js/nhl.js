document.addEventListener('DOMContentLoaded', () => {
  let playerData = [];

  // Fetch and parse the CSV file
  fetch('/Users/sebkeating/TOPSICS/^6/data/NHL-player-list.csv')
    .then(response => response.text())
    .then(csvText => {
      Papa.parse(csvText, {
        header: true,
        complete: function(results) {
          playerData = results.data;
          playerData.sort((a, b) => a.name.localeCompare(b.name)); // Sort by player name
          populateDatalist(playerData);
        }
      });
    })
    .catch(error => console.error('Error fetching CSV file:', error));

  function populateDatalist(players) {
    const datalist = document.getElementById('options');
    datalist.innerHTML = ''; // Clear existing options
    players.forEach((player) => {
      const option = document.createElement('option');
      option.value = `${player.name} (${player.team}, ${player.age}, ${player.position})`;
      datalist.appendChild(option);
    });
  }

  // Add player to the TOP6 ranking
  function addToRanking(playerName, inputElement) {
    const rankingItems = document.querySelectorAll('.ranking-item input');
    const existingPlayers = Array.from(rankingItems).map(input => input.value);

    if (!playerData.some(player => `${player.name} (${player.team}, ${player.age}, ${player.position})` === playerName)) {
      alert("Please select a valid player from the list.");
      inputElement.value = ''; // Clear the input field
      return;
    }

    if (existingPlayers.includes(playerName)) {
      alert("This player is already in your ranking.");
      inputElement.value = ''; // Clear the input field
      return;
    }

    inputElement.value = playerName; // Set the input field value
    hideSelectedOption(playerName); // Hide the selected player from the datalist
  }

  // Hide the selected player from the datalist
  function hideSelectedOption(playerName) {
    const options = document.querySelectorAll('#options option');
    options.forEach(option => {
      if (option.value === playerName) {
        option.classList.add('hidden');
      }
    });
  }

  // Show the deselected player in the datalist
  function showDeselectedOption(playerName) {
    const options = document.querySelectorAll('#options option');
    options.forEach(option => {
      if (option.value === playerName) {
        option.classList.remove('hidden');
      }
    });
  }

  // Handle form submission
  document.getElementById('top6-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const rankingItems = document.querySelectorAll('.ranking-item input');
    const filledItems = Array.from(rankingItems).filter(input => input.value.trim() !== '');
    if (filledItems.length !== 6) {
      alert("You must select exactly 6 players.");
      return;
    }

    const playerNames = filledItems.map((input, index) => `${index + 1}. ${input.value}`);
    alert("Your TOP6 ranking has been saved:\n" + playerNames.join('\n'));
  });

  // Add event listeners to input fields for adding players to the ranking
  for (let i = 1; i <= 6; i++) {
    const inputElement = document.getElementById(`select_${i}`);
    inputElement.addEventListener('change', (e) => {
      addToRanking(e.target.value, e.target);
    });
    inputElement.addEventListener('input', (e) => {
      if (e.target.value === '') {
        showDeselectedOption(e.target.dataset.previousValue); // Show the player if the input is cleared
        e.target.dataset.previousValue = ''; // Clear the previous value
      } else {
        e.target.dataset.previousValue = e.target.value; // Store the previous value
      }
    });
  }

  // Drag and drop functionality
  const rankingNames = document.querySelectorAll('.ranking-name');
  rankingNames.forEach(name => {
    name.addEventListener('dragstart', handleDragStart);
    name.addEventListener('dragover', handleDragOver);
    name.addEventListener('drop', handleDrop);
  });

  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.querySelector('input').id);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const draggingElement = document.querySelector('.dragging');
    const targetElement = e.target.closest('.ranking-name');
    if (targetElement && targetElement !== draggingElement) {
      const bounding = targetElement.getBoundingClientRect();
      const offset = bounding.y + bounding.height / 2;
      if (e.clientY - offset > 0) {
        targetElement.parentNode.insertBefore(draggingElement, targetElement.nextSibling);
      } else {
        targetElement.parentNode.insertBefore(draggingElement, targetElement);
      }
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    draggingElement.classList.remove('dragging');

    const draggedInputId = e.dataTransfer.getData('text/plain');
    const draggedInput = document.getElementById(draggedInputId);
    const targetInput = e.target.closest('.ranking-name').querySelector('input');

    // Swap the values of the dragged and target inputs
    const tempValue = draggedInput.value;
    draggedInput.value = targetInput.value;
    targetInput.value = tempValue;

    // Update the datalist to reflect the changes
    showDeselectedOption(tempValue);
    hideSelectedOption(draggedInput.value);
  }
});