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
//user name
document.addEventListener("DOMContentLoaded", () => {
      const branchName = localStorage.getItem('userName');
      if (branchName) {
        document.getElementById('userName').textContent = branchName;
        document.getElementById('hiddenuserName').value = branchName;        
      } else {  
        window.location.href = 'login.html';
      }      
});
  // db
  import { database, ref, onValue } from "./firebaseConfig.js";

  const collectionListDB = ref(database, `stickerdb`);
  const tblBodyEl = document.querySelector("#tableBody");
  
  // Fetch Data
  onValue(collectionListDB, (snapshot) => {
      if (snapshot.exists()) {
          let userArray = Object.entries(snapshot.val());
          const rows = userArray.map(([id, currentUserValue]) => `
              <tr>
                  <td>${currentUserValue.hiddenmainDate || "-"}</td> 
                  <td style="width: 50%;">${currentUserValue.hiddenbranch || "-"}</td> 
                  <td>${currentUserValue.usedstic || "-"}</td>                    
              </tr>
          `).join("");
  
          tblBodyEl.innerHTML = rows;
      } else {
          tblBodyEl.innerHTML = "<tr><td colspan='6'>No Records Found</td></tr>";
      }
  });
  