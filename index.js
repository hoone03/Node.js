import Web3 from 'web3';
import configuration from '../build/contracts/MyToken.json';
import 'bootstrap/dist/css/bootstrap.css';

const CONTRACT_ADDRESS = configuration.networks['11155111'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(Web3.givenProvider || 'https://mainnet.infura.io/v3/45cf67fcf2c9488aa781e84add29daa3');
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let account;
let userTickets = [];

const accountEl = document.getElementById('account');
const checkInBtn = document.getElementById('checkInBtn');
const buyTicketBtn = document.getElementById('buyTicketBtn');
const getGradeBtn = document.getElementById('getGradeBtn');
const give10TokensBtn = document.getElementById('give10TokensBtn');
const give100TokensBtn = document.getElementById('give100TokensBtn');
const getPermanentTokensBtn = document.getElementById('getPermanentTokensBtn');
const getPurchaseTokensBtn = document.getElementById('getPurchaseTokensBtn');
const modal = document.getElementById('myModal');
const modalTitle = document.getElementById('modalTitle');
const modalBtn = document.getElementById('modalBtn');
const modalResult = document.getElementById('modalResult');
const closeBtn = document.getElementsByClassName('close')[0];

const main = async () => {
  try {
    const accounts = await web3.eth.requestAccounts();
    account = accounts[0];
    accountEl.innerText = account;
  } catch (error) {
    console.error('Error retrieving accounts:', error);
  }
};

main();
// Get user's tickets function
async function getUserTickets() {
  try {
    const tickets = await contract.methods.getUserTickets(account).call();
    userTickets = tickets.map((tokenId) => Number(tokenId));
    console.log('User Tickets:', userTickets);
  } catch (error) {
    console.error('Get User Tickets error:', error);
  }
}
// Update the event listener for the "Get User Tickets" button
getTicketsBtn.addEventListener('click', async () => {
  try {
    // Toggle visibility of user's tickets
    const userTicketsContainer = document.getElementById('userTicketsContainer');
    const isVisible = userTicketsContainer.style.display === 'block';
    userTicketsContainer.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) {
      // Show user's tickets if they were not visible
      await getUserTickets();
      displayUserTickets();
    }
  } catch (error) {
    console.error('Get Tickets error:', error);
  }
});
// Function to display user's tickets in HTML
function displayUserTickets() {
  const userTicketsContainer = document.getElementById('userTicketsContainer');
  userTicketsContainer.innerHTML = '';

  const ticketContainer = document.createElement('div');
  ticketContainer.classList.add('ticket-container');

  userTickets.forEach((tokenId) => {
    const ticketElement = document.createElement('p');
    ticketElement.innerText = `Ticket ID: ${tokenId}`;
    ticketContainer.appendChild(ticketElement);
  });

  userTicketsContainer.appendChild(ticketContainer);
}
// Update the getUserTickets function
async function getUserTickets() {
  try {
    const tickets = await contract.methods.getUserTickets(account).call();
    userTickets = tickets.map((tokenId) => Number(tokenId));
    console.log('User Tickets:', userTickets);

    // Call the displayUserTickets function to show the tickets in HTML
    displayUserTickets();
  } catch (error) {
    console.error('Get User Tickets error:', error);
  }
}
checkInBtn.addEventListener('click', async () => {
  try {
    await contract.methods.checkIn().send({ from: account });
    console.log('Check-in successful');
  } catch (error) {
    console.error('Check-in error:', error);
  }
});

buyTicketBtn.addEventListener('click', async () => {
  try {
    await contract.methods.buyPremiumTicket().send({ from: account });
    console.log('Ticket purchased successfully');
  } catch (error) {
    console.error('Ticket purchase error:', error);
  }
});


getGradeBtn.addEventListener('click', () => {
    modalTitle.innerText = 'Get Grade';
    modalResult.innerText = '';
    modal.style.display = 'block';
  });

  
give10TokensBtn.addEventListener('click', async () => {
  try {
    await contract.methods.give10tokens().send({ from: account });
    console.log('Given 10 tokens');
  } catch (error) {
    console.error('Give 10 tokens error:', error);
  }
});

give100TokensBtn.addEventListener('click', async () => {
  try {
    await contract.methods.give100tokens().send({ from: account });
    console.log('Given 100 tokens');
  } catch (error) {
    console.error('Give 100 tokens error:', error);
  }
});

getPermanentTokensBtn.addEventListener('click', () => {
    modalTitle.innerText = 'Get Permanent Token Count';
    modalResult.innerText = '';
    modal.style.display = 'block';
  });

getPurchaseTokensBtn.addEventListener('click', () => {
    modalTitle.innerText = 'Get Purchase Token Count';
    modalResult.innerText = '';
    modal.style.display = 'block';
    });

modalBtn.addEventListener('click', async () => {
  try {
    const addressInput = document.getElementById('addressInput');
    const address = addressInput.value;

    if (modalTitle.innerText === 'Get Grade') {
      const grade = await contract.methods.fanGrades(address).call();
      modalResult.innerText = `Grade: ${grade}`;
    } else if (modalTitle.innerText === 'Get Permanent Token Count') {
      const permanentTokens = await contract.methods.permanentTokenBalances(address).call();
      modalResult.innerText = `Permanent tokens: ${permanentTokens}`;
    } else if (modalTitle.innerText === 'Get Purchase Token Count') {
      const purchaseTokens = await contract.methods.purchaseTokenBalances(address).call();
      modalResult.innerText = `Purchase tokens: ${purchaseTokens}`;
    }
  } catch (error) {
    console.error('Modal error:', error);
    modalResult.innerText = 'Error occurred. Please check the console.';
  }
});
    
    closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
    });   