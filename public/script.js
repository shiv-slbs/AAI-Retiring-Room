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

// Prevent check-out before check-in
document.getElementById("checkin").addEventListener("change", function () {
  document.getElementById("checkout").setAttribute("min", this.value);
});

// Sign In Validation with Server-Side Duplicate Check
function signIn() {
  const name = document.getElementById("fullname").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();

  const nameRegex = /^[A-Za-z\s]+$/;
  const mobileRegex = /^\d{10}$/;

  if (!name || !nameRegex.test(name)) {
    alert("Please enter a valid name without numbers or symbols.");
    return;
  }

  if (!mobileRegex.test(mobile)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  if (!email.includes("@")) {
    alert("Please enter a valid email address.");
    return;
  }

  // Send to server for duplicate check and save
  fetch("/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fullName: name,
      mobileNo: mobile,
      emailId: email
    })
  })
    .then(response => {
      if (response.status === 409) {
        throw new Error("User already exists with this email or mobile number.");
      }
      if (!response.ok) {
        throw new Error("Failed to register user.");
      }
      return response.text();
    })
    .then(message => {
      console.log(message);
      document.getElementById("signInSection").style.display = "none";
      document.getElementById("booking-sections").style.display = "block";
      document.getElementById("welcomeBox").style.display = "block";
      document.getElementById("welcomeBox").innerText = `Welcome, ${name}`;
    })
    .catch(err => {
      alert(err.message);
    });
}


// Booking Amount Calculation
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

  const rate = roomType === "1" ? 700 : roomType === "2" ? 1000 : 1500;
  const hours = endHour - startHour;
  const total = rate * hours;

  display.textContent = `₹${total}`;
  validateBookingFields(); // re-check booking button status
}

// Booking Summary
function showSummary() {
  const name = document.getElementById("fullname").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();
  const arrival = document.getElementById("arrival").value.trim();
  const departure = document.getElementById("departure").value.trim();
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const roomType = document.getElementById("roomType").value;
  const startHour = parseInt(document.getElementById("startHour").value);
  const endHour = parseInt(document.getElementById("endHour").value);

  if (!name || !mobile || !email || !arrival || !departure || !checkin || !checkout || !roomType || isNaN(startHour) || isNaN(endHour)) {
    alert("Please fill all fields correctly.");
    return;
  }

  if (endHour <= startHour) {
    alert("End hour must be after start hour.");
    return;
  }

  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);
  if (checkoutDate < checkinDate) {
    alert("Check-out date must be the same or after check-in date.");
    return;
  }

  const rate = roomType === "1" ? 700 : roomType === "2" ? 1000 : 1500;
  const roomText = roomType === "1" ? "Room Type 1 (₹700/hr)" : roomType === "2" ? "Room Type 2 (₹1000/hr)" : "Room Type 3 (₹1500/hr)";
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

  const summary = document.getElementById("summarySection");
  summary.style.display = "block";
  summary.scrollIntoView({ behavior: "smooth" });
}

// Enable/Disable Book Now Button
const bookBtn = document.querySelector('button[onclick="showSummary()"]');
const bookingFields = [
  "arrival", "departure", "checkin", "checkout", "roomType", "startHour", "endHour"
];

function validateBookingFields() {
  const allFilled = bookingFields.every(id => {
    const el = document.getElementById(id);
    return el && el.value.trim() !== "";
  });

  const start = parseInt(document.getElementById("startHour").value);
  const end = parseInt(document.getElementById("endHour").value);
  const validTime = !isNaN(start) && !isNaN(end) && start < end;

  bookBtn.disabled = !(allFilled && validTime);
}

bookingFields.forEach(id => {
  document.getElementById(id).addEventListener("input", validateBookingFields);
});

bookBtn.disabled = true; // initially disabled
function togglePayButton() {
  const checkbox = document.getElementById("termsCheckbox");
  const payButton = document.getElementById("payButton");
  payButton.disabled = !checkbox.checked;
}
function redirectToPayment() {
  window.location.href = 'payment.html';
}

// When returning from payment
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('bookingConfirmed') === 'true') {
    localStorage.removeItem('bookingConfirmed');

    // Simulated data (replace with actual variables if available)
    const bookingNo = 'AAI' + Math.floor(Math.random() * 90000 + 10000);
    const name = document.getElementById('fullname')?.value || 'Guest';
    const email = document.getElementById('email')?.value || 'guest@example.com';

    document.getElementById('modalBookingNo').textContent = bookingNo;
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalEmail').textContent = email;

    // Generate QR using an API (or use your own logic)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Booking:${bookingNo}`;
    document.getElementById('qrCode').src = qrUrl;

    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    confirmationModal.show();
  }
});
