const db = new Dexie('shoppingApp');
db.version(1).stores({ items: '++id, name, price, isPurchased' });

const itemForm = document.getElementById('itemForm');
const itemsDiv = document.getElementById('itemsDiv');
const totalPriceDiv = document.getElementById('totalPriceDiv');

const populateItemsDiv = async () => {
   const allItems = await db.items.reverse().toArray();
   console.log(allItems);

   itemsDiv.innerHTML = allItems
      .map(
         (item) => `
      <div class="item ${item.isPurchased && 'purchased'}">
         <label>
            <input type="checkbox" class="checkbox" onchange="toggleItemStatus(event, ${
               item.id
            })" ${item.isPurchased && 'checked'}>
         </label>

         <div class="itemInfo">
            <p>${item.name}</p>
            <p><strong>R</strong> ${item.price} x ${item.quantity}</p>
         </div>

         <button class="deleteButton">X</button>
      </div>
   `
      )
      .join('');

   const arrayOfPrices = allItems.map((item) => item.price * item.quantity);
   const totalPrice = arrayOfPrices.reduce((total, price) => total + price, 0);

   totalPriceDiv.innerHTML = `Total Price: <strong>R</strong> ${totalPrice}`;
};

window.onload = populateItemsDiv;

itemForm.onsubmit = async (event) => {
   event.preventDefault();

   const name = document.getElementById('nameInput').value;
   const quantity = document.getElementById('quantityInput').value;
   const price = document.getElementById('priceInput').value;

   await db.items.add({ name, quantity, price });
   await populateItemsDiv();

   itemForm.reset();
};

const toggleItemStatus = async (event, id) => {
   await db.items.update(id, { isPurchased: !!event.target.checked });
   await populateItemsDiv();
};
