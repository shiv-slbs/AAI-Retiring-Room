window.onload = function () {
  const start = document.getElementById("startHour");
  const end = document.getElementById("endHour");
  for (let i = 0; i < 24; i++) {
    start.innerHTML += `<option value="${i}">${i}:00</option>`;
    end.innerHTML += `<option value="${i + 1}">${i + 1}:00</option>`;
  }
};

function signIn() {
  const name = document.getElementById("fullname").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !mobile || !email) {
    alert("Please fill in all fields to sign in.");
    return;
  }

  document.getElementById("signInSection").style.display = "none";
  document.getElementById("booking-sections").style.display = "block";
  document.getElementById("welcomeBox").style.display = "block";
  document.getElementById("welcomeBox").innerText = `Welcome, ${name}`;
}

function updateAmount() {
  const roomType = document.getElementById("roomType").value;
  const startHour = parseInt(document.getElementById("startHour").value);
  const endHour = parseInt(document.getElementById("endHour").value);
  const display = document.getElementById("totalAmount");

  if (!roomType || isNaN(startHour) || isNaN(endHour)) {
    display.textContent = "₹0";
    return;
  }

  if (endHour <= startHour) {
    display.textContent = "Invalid time slot";
    return;
  }

  const hours = endHour - startHour;
  let rate = 0;

  switch (roomType) {
    case "1": rate = 700; break;
    case "2": rate = 1000; break;
    case "3": rate = 1500; break;
  }

  const total = rate * hours;
  display.textContent = `₹${total}`;
}

function showSummary() {
  const name = document.getElementById("fullname").value;
  const mobile = document.getElementById("mobile").value;
  const email = document.getElementById("email").value;

  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;

  const roomType = document.getElementById("roomType").value;
  const startHour = parseInt(document.getElementById("startHour").value);
  const endHour = parseInt(document.getElementById("endHour").value);

  if (!roomType || isNaN(startHour) || isNaN(endHour) || endHour <= startHour) {
    alert("Please select valid room type and time slot.");
    return;
  }

  let rate = 0;
  let roomText = "";
  switch (roomType) {
    case "1": rate = 700; roomText = "Room Type 1 (₹700/hr)"; break;
    case "2": rate = 1000; roomText = "Room Type 2 (₹1000/hr)"; break;
    case "3": rate = 1500; roomText = "Room Type 3 (₹1500/hr)"; break;
  }

  const hours = endHour - startHour;
  const amount = rate * hours;
  const gst = amount * 0.18;
  const total = amount + gst;

  document.getElementById("summaryName").innerText = name;
  document.getElementById("summaryMobile").innerText = mobile;
  document.getElementById("summaryEmail").innerText = email;
  document.getElementById("summaryArrival").innerText = arrival;
  document.getElementById("summaryDeparture").innerText = departure;
  document.getElementById("summaryCheckin").innerText = checkin;
  document.getElementById("summaryCheckout").innerText = checkout;
  document.getElementById("summaryRoomType").innerText = roomText;
  document.getElementById("summaryStart").innerText = `${startHour}:00`;
  document.getElementById("summaryEnd").innerText = `${endHour}:00`;

  document.getElementById("amountExcl").innerText = amount.toFixed(2);
  document.getElementById("gstAmount").innerText = gst.toFixed(2);
  document.getElementById("totalWithGst").innerText = total.toFixed(2);

  document.getElementById("summarySection").style.display = "block";
}
