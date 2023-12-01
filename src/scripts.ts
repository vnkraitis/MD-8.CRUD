import axios from "axios";

// Define the type for the equipment
type Equipment = {
  id: number;
  name: string;
  amount: number;
  condition: string;
  photoUrl: string;
};

const equipmentWrapper = document.querySelector<HTMLDivElement>(".js-equipment-wrapper");
const equipmentForm = document.querySelector<HTMLFormElement>(".js-equipment-form");

// Function to display all equipment
const drawEquipments = () => {
  equipmentWrapper.innerHTML = '';

  axios.get<Equipment[]>("http://localhost:3004/equipments").then(({ data }) => {
    data.forEach((equipment) => {
      equipmentWrapper.innerHTML += `
        <div class="equipment">
          <img src="${equipment.photoUrl}" alt="${equipment.name}" style="max-width: 100px; height: auto;"/>
          <h1>${equipment.name}</h1>
          <p>Amount: ${equipment.amount}</p>
          <p>Condition: ${equipment.condition}</p>
          <button class="js-equipment-delete" data-equipment-id="${equipment.id}">Delete</button>
          <hr>
        </div>
      `;
    });

    document.querySelectorAll<HTMLButtonElement>(".js-equipment-delete").forEach(button => {
      button.addEventListener("click", (event) => {
        const equipmentId = button.getAttribute("data-equipment-id");
        axios.delete(`http://localhost:3004/equipments/${equipmentId}`).then(() => {
          drawEquipments();
        });
      });
    });
  });
};

// Initialize the display
drawEquipments();

// Handling form submission
equipmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = equipmentForm.querySelector<HTMLInputElement>('input[name="equipment-name"]');
  const amountInput = equipmentForm.querySelector<HTMLInputElement>('input[name="amount"]');
  const conditionInput = equipmentForm.querySelector<HTMLInputElement>('input[name="condition"]');
  const photoInput = equipmentForm.querySelector<HTMLInputElement>('input[name="photo"]');

  const newEquipment = {
    name: nameInput.value,
    amount: parseInt(amountInput.value),
    condition: conditionInput.value,
    photoUrl: photoInput.value
  };

  axios.post<Equipment>("http://localhost:3004/equipments", newEquipment).then(() => {
    nameInput.value = '';
    amountInput.value = '';
    conditionInput.value = '';
    photoInput.value = '';
    drawEquipments();
  });
});
