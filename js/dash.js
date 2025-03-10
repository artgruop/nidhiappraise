//  date & time
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

    const staff1 = localStorage.getItem('staff1') || "N/A";
    const staff2 = localStorage.getItem('staff2') || "N/A";
    const staff3 = localStorage.getItem('staff3') || " ";    
    if (branchName && mainDate) {        
        const mainDateEl = document.getElementById('mainDate');
        if (mainDateEl) mainDateEl.textContent = formattedMainDate;        
        const hiddenMainDateEl = document.getElementById('hiddenmainDate');
        if (hiddenMainDateEl) hiddenMainDateEl.value = formattedMainDate;       
        const branchEl = document.getElementById('branch');
        if (branchEl) branchEl.textContent = branchName;        
        const hiddenBranchEl = document.getElementById('hiddenbranch');
        if (hiddenBranchEl) hiddenBranchEl.value = branchName;        
        const brMgrEl = document.getElementById('brmgr');
        if (brMgrEl) brMgrEl.textContent = staff1;        
        const hiddenBrMgrEl = document.getElementById('hiddenbrmgr');
        if (hiddenBrMgrEl) hiddenBrMgrEl.value = staff1;
        const staff1El = document.getElementById('stff1');
        if (staff1El) staff1El.textContent = staff2;        
        const hiddenStaff1El = document.getElementById('hiddenstff1');
        if (hiddenStaff1El) hiddenStaff1El.value = staff2;
        const staff2El = document.getElementById('stff2');
        if (staff2El) staff2El.textContent = staff3;        
        const hiddenStaff2El = document.getElementById('hiddenstff2');
        if (hiddenStaff2El) hiddenStaff2El.value = staff3;
    } else {        
        window.location.href = 'info.html';
    }
});
//user name---------------------------------------
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
import { database, ref, push, onValue } from "./firebaseConfig.js";


function getCurrentDateTime() {
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]; 
    const formattedTime = now.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
}
const maindate = localStorage.getItem('mainDate') || "Unknown Date";  
const branchName = localStorage.getItem('brName') || "Unknown Branch";
const appraisernm = localStorage.getItem('userName');
const formattedDate = maindate.replace(/\//g, '-');
const collectionListDB = ref(database, `goldvrfy/${appraisernm}/${branchName}/${formattedDate}`);

const mainappraisForm = document.getElementById("mainappraisForm");
const tblBodyEl = document.querySelector("#tableBody");

const dateEL = document.querySelector("#hiddenmainDate");
const branchEL = document.querySelector("#hiddenbranch");
const staffmanagerEl = document.querySelector("#hiddenbrmgr");
const stafclrk1El = document.querySelector("#hiddenstff1");
const stafclrk2EL = document.querySelector("#hiddenstff2");

const apserEL = localStorage.getItem("userName")

const pledgeEL = document.querySelector("#Pledge");
const glwgtEL = document.querySelector("#glwgt");
const stnwgtEL = document.querySelector("#stnwgt");
const netwgtEL = document.querySelector("#netwgt");
const lonamtEL = document.querySelector("#lonamt");
const remarkEL = document.querySelector("#remark");
mainappraisForm.addEventListener("submit", function (e) {
    e.preventDefault(); 

    const collect = {    
        hiddenmainDate: dateEL.value,
        hiddenbranch: branchEL.value,
        hiddenbrmgr: staffmanagerEl.value,
        hiddenstff1: stafclrk1El.value,
        hiddenstff2: stafclrk2EL.value,
        userName: apserEL,
        Pledge: pledgeEL.value,
        glwgt: glwgtEL.value,
        stnwgt: stnwgtEL.value,
        netwgt: netwgtEL.value,
        lonamt: lonamtEL.value,
        remark: remarkEL.value,        
        dateTime: getCurrentDateTime()
    };
const messageContainer = document.getElementById("messageContainer");
push(collectionListDB, collect)
    .then(() => {
        messageContainer.innerHTML =`<p class="success-message">✔ Saved successfully!</p>`;
        mainappraisForm.reset(); 
    })
    .catch((error) => {
        console.error("Error adding data: ", error);
        messageContainer.innerHTML = `<p class="error-message">❌ Not Saved: ${error.message}. Please try again.</p>`;
    });

});
// Fetch Data from db
onValue(collectionListDB, function(snapshot){
    if(snapshot.exists()){
        let userArray = Object.entries(snapshot.val());
        tblBodyEl.innerHTML = "";

        userArray.forEach(([id, currentUserValue]) => {
            tblBodyEl.innerHTML += `
                <tr>
                    <td>${currentUserValue.Pledge || "-"}</td> 
                    <td>${currentUserValue.glwgt || "-"}</td> 
                    <td>${currentUserValue.stnwgt || "-"}</td> 
                    <td>${currentUserValue.netwgt || "-"}</td>
                    <td>${currentUserValue.lonamt || "-"}</td>
                    <td>${currentUserValue.remark || "-"}</td>
                </tr>
            `;
        });
    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='11'>No Records Found</td></tr>";
    }
});
