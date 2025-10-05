function greetUser() {
  let name = document.getElementById("nameInput").value;
  if (name.trim() !== "") {
    document.getElementById("greeting").innerText = "Hello, " + name;
  } else {
    document.getElementById("greeting").innerText = "Hello";
  }
}

// Function to change box color on click
function changeColor(element, color) {
  element.style.backgroundColor = color;
}
