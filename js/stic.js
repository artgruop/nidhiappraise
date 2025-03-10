// date as DD/MM/YYYY
function formatDate(dateString) {
    if (!dateString) return "Unknown Date"; 
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
// Load and fill 
document.addEventListener("DOMContentLoaded", () => {      
      const branchName = localStorage.getItem('brName');
      const mainDate = localStorage.getItem('mainDate');
      const formattedMainDate = formatDate(mainDate); 
      if (branchName && mainDate) {        
          const mainDateEl = document.getElementById('mainDate');
          if (mainDateEl) mainDateEl.textContent = formattedMainDate;          
          const hiddenMainDateEl = document.getElementById('hiddenmainDate');
          if (hiddenMainDateEl) hiddenMainDateEl.value = formattedMainDate;         
          const branchEl = document.getElementById('branch');
          if (branchEl) branchEl.textContent = branchName;        
          const hiddenBranchEl = document.getElementById('hiddenbranch');
          if (hiddenBranchEl) hiddenBranchEl.value = branchName;
      } else {          
          window.location.href = 'info.html';
      }
});  
//branch name
document.addEventListener("DOMContentLoaded", () => {
      const branchName = localStorage.getItem('userName');
      if (branchName) {
        document.getElementById('userName').textContent = branchName;
        document.getElementById('hiddenuserName').value = branchName;        
      } else {  
        window.location.href = 'login.html';
      }      
});

// total stic
   const usedStickerInput = document.getElementById("usedstic");
   const damagedStickerInput = document.getElementById("damaged");
   const totalStickerInput = document.getElementById("totlsick");  

    function updateTotal() {
       const usedStickers = parseInt(usedStickerInput.value) || 0;
       const damagedStickers = parseInt(damagedStickerInput.value) || 0;
       totalStickerInput.value = usedStickers + damagedStickers;
   }
   usedStickerInput.addEventListener("input", updateTotal);
   damagedStickerInput.addEventListener("input", updateTotal); 


  // db
import { database, ref, push, onValue } from "./firebaseConfig.js";


  const collectionListDB = ref(database, `stickerdb`);
  const mainappraisForm = document.getElementById("stickerForm");
  const tblBodyEl = document.querySelector("#tableBody");  
  const dateEL = document.querySelector("#hiddenmainDate");
  const branchEL = document.querySelector("#hiddenbranch");   
  const usedsticEL = document.querySelector("#usedstic");
  const damagedEL = document.querySelector("#damaged");
  const totaldEL = document.querySelector("#totlsick");

  const totalStickerEl = document.getElementById("totalSticker"); // Total for `totlsick`
  const totalReceivedEl = document.getElementById("totalReceived"); // Total for `recevd`
  const balanceEl = document.getElementById("balance")

  function updateBalance() {
    const used = parseInt(totalStickerEl.textContent.replace(/\D/g, "")) || 0; // Extract numbers
    const received = parseInt(totalReceivedEl.textContent.replace(/\D/g, "")) || 0;
    balanceEl.textContent = received - used; // Update balance
}

  mainappraisForm.addEventListener("submit", function (e) {
      e.preventDefault();   
      const collect = {    
          hiddenmainDate: dateEL.value,
          hiddenbranch: branchEL.value,         
          usedstic: usedsticEL.value,
          damaged: damagedEL.value,
          totlsick: totaldEL.value,                   
      };
  const messageContainer = document.getElementById("messageContainer");
  push(collectionListDB, collect)
      .then(() => {
          messageContainer.innerHTML = `<p class="success-message">✔ Saved successfully!</p>`;
          mainappraisForm.reset();
      })
      .catch((error) => {
          console.error("Error adding data: ", error);
          messageContainer.innerHTML = `<p class="error-message">❌ Not Saved: ${error.message}. Please try again.</p>`;
      });  
  });  
  // Fetch Data 
  onValue(collectionListDB, function (snapshot) {
    if (snapshot.exists()) {
        let userArray = Object.entries(snapshot.val());
        tblBodyEl.innerHTML = "";

        let totalSick = 0;
        let totalReceived = 0;

        userArray.forEach(([id, currentUserValue]) => {
            let totlsickValue = parseInt(currentUserValue.totlsick) || 0;
            let recevdValue = parseInt(currentUserValue.recevd) || 0;

            totalSick += totlsickValue;
            totalReceived += recevdValue;

            tblBodyEl.innerHTML += `
                <tr>
                    <td>${currentUserValue.hiddenmainDate || "-"}</td> 
                    <td>${currentUserValue.hiddenbranch || "-"}</td> 
                    <td>${currentUserValue.usedstic || "-"}</td>
                    <td>${currentUserValue.damaged || "-"}</td>
                    <td>${totlsickValue}</td>
                    <td>${recevdValue}</td>
                </tr>
            `;
        });

        // Update totals
        totalStickerEl.textContent = `${totalSick}`;
        totalReceivedEl.textContent = `${totalReceived}`;        

        updateBalance(); // ✅ Update balance after updating totals
    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='6'>No Records Found</td></tr>";
        
    }
});