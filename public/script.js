window.onload = function () {
  const start = document.getElementById("startHour");
  const end = document.getElementById("endHour");
  for (let i = 0; i < 24; i++) {
    start.innerHTML += `<option value="${i}">${i}:00</option>`;
    end.innerHTML += `<option value="${i + 1}">${i + 1}:00</option>`;
  }

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("checkin").setAttribute("min", today);
};

document.getElementById("checkin").addEventListener("change", function () {
  document.getElementById("checkout").setAttribute("min", this.value);
});

async function signIn() {
  const name = document.getElementById("fullname").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();

  const nameRegex = /^[A-Za-z\s]+$/;
  const mobileRegex = /^\d{10}$/;

  if (!name || !nameRegex.test(name)) return alert("Enter a valid name.");
  if (!mobileRegex.test(mobile)) return alert("Enter a valid 10-digit mobile.");
  if (!email.includes("@")) return alert("Enter a valid email.");

  try {
    const checkRes = await fetch("/check-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobileNo: mobile, emailId: email })
    });

    let userId;
    if (checkRes.status === 200) {
      const data = await checkRes.json();
      userId = data.userId;
      console.log("User exists.");
    } else if (checkRes.status === 404) {
      const registerRes = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, mobileNo: mobile, emailId: email })
      });

      const data = await registerRes.json();
      if (!registerRes.ok) throw new Error(data.message);
      userId = data.userId;
      console.log("User registered.");
    } else {
      throw new Error("Unexpected response from server.");
    }

    localStorage.setItem("userId", userId);

    document.getElementById("signInSection").style.display = "none";
    document.getElementById("booking-sections").style.display = "block";
    document.getElementById("welcomeBox").style.display = "block";
    document.getElementById("welcomeBox").innerText = `Welcome, ${name}`;
  } catch (err) {
    alert(err.message);
  }
}

function getRoomObjectIdFromDropdown(value) {
  const roomMap = {
    "1": "6860f565e00cd2d3135274a7",
    "2": "6860f565e00cd2d3135274a8",
    "3": "6860f565e00cd2d3135274a9"
  };
  return roomMap[value] || null;
}



function updateAmount() {
  const roomType = document.getElementById('roomType').value;
  const startHour = parseInt(document.getElementById('startHour').value);
  const endHour = parseInt(document.getElementById('endHour').value);
  const amountSpan = document.getElementById('totalAmount');

  // Room rates per hour
  const rates = {
    "1": 700,
    "2": 1000,
    "3": 1500
  };

  // Validate inputs
  if (!roomType || isNaN(startHour) || isNaN(endHour) || startHour >= endHour) {
    amountSpan.textContent = "₹0";
    return;
  }

  const hours = endHour - startHour;
  const rate = rates[roomType];
  const totalAmount = hours * rate;

  amountSpan.textContent = `₹${totalAmount}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const startHourSelect = document.getElementById("startHour");
  const endHourSelect = document.getElementById("endHour");

  for (let i = 0; i <= 23; i++) {
    const optionStart = new Option(`${i}:00`, i);
    const optionEnd = new Option(`${i}:00`, i);
    startHourSelect.add(optionStart);
    endHourSelect.add(optionEnd);
  }
});

function showSummary() {
  // Get values from form inputs
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

  const roomTypeMap = {
    "1": { label: "Room Type 1 (₹700/hr)", rate: 700 },
    "2": { label: "Room Type 2 (₹1000/hr)", rate: 1000 },
    "3": { label: "Room Type 3 (₹1500/hr)", rate: 1500 }
  };

  if (!roomTypeMap[roomType] || isNaN(startHour) || isNaN(endHour) || startHour >= endHour) {
    alert("Please select a valid Room Type and valid Start/End Hour.");
    return;
  }

  const hours = endHour - startHour;
  const rate = roomTypeMap[roomType].rate;
  const baseAmount = hours * rate;
  const gstAmount = (baseAmount * 0.18).toFixed(2);
  const totalWithGst = (baseAmount + parseFloat(gstAmount)).toFixed(2);

  // Set summary values
  document.getElementById("summaryName").textContent = name;
  document.getElementById("summaryMobile").textContent = mobile;
  document.getElementById("summaryEmail").textContent = email;
  document.getElementById("summaryArrival").textContent = arrival;
  document.getElementById("summaryDeparture").textContent = departure;
  document.getElementById("summaryCheckin").textContent = checkin;
  document.getElementById("summaryCheckout").textContent = checkout;
  document.getElementById("summaryRoomType").textContent = roomTypeMap[roomType].label;
  document.getElementById("summaryStart").textContent = `${startHour}:00`;
  document.getElementById("summaryEnd").textContent = `${endHour}:00`;
  document.getElementById("amountExcl").textContent = baseAmount.toFixed(2);
  document.getElementById("gstAmount").textContent = gstAmount;
  document.getElementById("totalWithGst").textContent = totalWithGst;

  // Show the summary section
  document.getElementById("summarySection").style.display = "block";

  // Scroll to summary section
  document.getElementById("summarySection").scrollIntoView({ behavior: "smooth" });
}

function togglePayButton() {
  const checkbox = document.getElementById("termsCheckbox");
  const payButton = document.getElementById("payButton");

  payButton.disabled = !checkbox.checked;
}




async function SaveBookingDetails() {
  try {
    const userId = localStorage.getItem("userId");
    const pnr = prompt("Enter PNR Number");

    if (!userId || !pnr) {
      alert("Missing User ID or PNR!");
      return;
    }

    // Extract and parse values from DOM
    const arrivalFlightNo = document.getElementById("summaryArrival").innerText.trim();
    const departureFlightNo = document.getElementById("summaryDeparture").innerText.trim();
    const checkinDate = new Date(document.getElementById("summaryCheckin").innerText);
    const checkoutDate = new Date(document.getElementById("summaryCheckout").innerText);
    const roomType = getRoomObjectIdFromDropdown(document.getElementById("roomType").value); // Must return valid Room ObjectId
    const startHour = parseInt(document.getElementById("summaryStart").innerText);
    const endHour = parseInt(document.getElementById("summaryEnd").innerText);
    const amountBeforeGst = parseFloat(document.getElementById("amountExcl").innerText);
    const gstAmount = parseFloat(document.getElementById("gstAmount").innerText);
    const totalAmount = parseFloat(document.getElementById("totalWithGst").innerText);
    const hoursBooked = endHour - startHour;

    // Construct payload matching backend schema
    const payload = {
      userId,
      arrivalFlightNo,
      departureFlightNo,
      pnr,
      checkinDate,
      checkoutDate,
      roomType,
      startHour,
      endHour,
      hoursBooked,
      amount: amountBeforeGst,
      gst: gstAmount,
      totalAmount
    };

    // Send to server
    const res = await fetch("/save-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Booking failed.");
    }

    alert("✅ Booking saved successfully!");
  } catch (err) {
    alert("❌ Booking error: " + err.message);
  }
}



async function HandlePayment() {
  try {
    await SaveBookingDetails();

    // Generate fake booking number
    const bookingNo = 'AAI' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    // Extract details from summary
    const name = document.getElementById("summaryName").innerText;
    const email = document.getElementById("summaryEmail").innerText;

    // Generate QR code using external service
    const qrData = `Booking No: ${bookingNo}\nName: ${name}\nEmail: ${email}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

    // Populate popup
    document.getElementById("popupBookingNo").innerText = bookingNo;
    document.getElementById("popupName").innerText = name;
    document.getElementById("popupEmail").innerText = email;
    document.getElementById("popupQRCode").src = qrUrl;

    // Show popup
    const popup = document.getElementById("paymentConfirmationPopup");
    popup.style.display = "block";
    popup.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    alert("Payment failed: " + error.message);
  }
}

