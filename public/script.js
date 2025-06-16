// 📄 public/script.js — Frontend SPA Logic

window.onload = function () {
  const start = document.getElementById("startHour");
  const end = document.getElementById("endHour");

  for (let i = 0; i < 24; i++) {
    const startOption = document.createElement("option");
    const endOption = document.createElement("option");
    startOption.value = i;
    startOption.textContent = `${i}:00`;
    endOption.value = i + 1;
    endOption.textContent = `${i + 1}:00`;
    start.appendChild(startOption);
    end.appendChild(endOption);
  }

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkin").setAttribute("min", today);
};

document.getElementById("checkin").addEventListener("change", function () {
  document.getElementById("checkout").setAttribute("min", this.value);
});

function signIn() {
  const name = document.getElementById("fullname").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !mobile || !email) {
    alert("Please fill in all fields to sign in.");
    return;
  }

  fetch("/submit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fullName: name, mobileNo: mobile, emailId: email })
})
  .then((res) => {
    if (!res.ok) {
      return res.text().then((msg) => { throw new Error(msg); });
    }
    return res.text();
  })
  .then((msg) => console.log(msg))
  .catch((err) => alert(err.message));

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

  const rateMap = { "1": 700, "2": 1000, "3": 1500 };
  const total = rateMap[roomType] * (endHour - startHour);
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

  if (!checkin || !checkout) return alert("Please select check-in and check-out dates.");
  if (new Date(checkout) < new Date(checkin)) return alert("Check-out date cannot be before check-in date.");
  if (!roomType || isNaN(startHour) || isNaN(endHour) || endHour <= startHour) return alert("Invalid room or time slot.");

  const rateMap = { "1": { rate: 700, text: "Room Type 1 (₹700/hr)" }, "2": { rate: 1000, text: "Room Type 2 (₹1000/hr)" }, "3": { rate: 1500, text: "Room Type 3 (₹1500/hr)" } };
  const { rate, text: roomText } = rateMap[roomType];

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
  document.getElementById("summarySection").scrollIntoView({ behavior: "smooth" });
}
