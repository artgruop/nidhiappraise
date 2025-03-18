//data format
function formatDate(dateString) {
  if (!dateString) return "Unknown Date";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; 
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function getCurrentDateTime() {
  const now = new Date();
  return formatDate(now); 
}
const mainDateEl = document.getElementById('mainDate');
if (mainDateEl) {
  mainDateEl.textContent = getCurrentDateTime();
}
//user name
document.addEventListener("DOMContentLoaded", () => {
    const branchName = localStorage.getItem('userName');  
    if (branchName) {
      document.getElementById('userName').textContent = branchName;
      document.getElementById('hiddenuserName').value = branchName;
    } else {
      window.location.href = './';
    }
  });
//branch name droplist
 document.addEventListener("DOMContentLoaded", function () {
    const branchSelect = document.getElementById("brName");
    fetch("resources/droplist.json")
        .then(response => response.json())
        .then(data => {
            branchSelect.innerHTML = `<option value="" disabled selected>Select Branch</option>`;
            data.branches.forEach(branch => {
                const option = document.createElement("option");
                option.value = branch;
                option.textContent = branch;
                branchSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading branches:", error));
});
document.getElementById('appraisForm').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const date = document.getElementById('mainDate').textContent.trim(); // Fixed issue
  const branch = document.getElementById('brName').value.trim();
  const staff1 = document.getElementById('staff1').value.trim();
  const staff2 = document.getElementById('staff2').value.trim();
  const staff3 = document.getElementById('staff3').value.trim();    

  if (!date || !branch || !staff1 || !staff2) {
      alert('Please fill in all required fields.');
      return;
  }

  try {
      localStorage.setItem('mainDate', date);
      localStorage.setItem('brName', branch);
      localStorage.setItem('staff1', staff1);
      localStorage.setItem('staff2', staff2);
      
      if (staff3) {
          localStorage.setItem('staff3', staff3);
      }

      window.location.href = './home';
  } catch (error) {
      console.error("Failed to save branch info in localStorage:", error);
      alert("Failed to save data. Please try again.");
  }
});