const savedName =
  localStorage.getItem("userName") || "Student Name";

const savedEmail =
  localStorage.getItem("userEmail") || "student@gmail.com";

document.getElementById("profileName").innerText =
  savedName;

document.getElementById("studentName").innerText =
  savedName;

document.getElementById("profileEmail").innerText =
  savedEmail;