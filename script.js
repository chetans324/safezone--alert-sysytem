emailjs.init("q9dPXKqDqqpl2RD6F");   

const alertBtn  = document.getElementById("alertBtn");
const statusMsg = document.getElementById("statusMsg");
const qrBox     = document.getElementById("qrBox");
const mapBox    = document.getElementById("map");

alertBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported on this device!");
    return;
  }
  statusMsg.textContent = "Fetching location…";
  navigator.geolocation.getCurrentPosition(showLocation, showError, {
    enableHighAccuracy: true
  });
});

function showLocation(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  statusMsg.textContent = "Location fetched!";

  const map = new google.maps.Map(mapBox, {
    center: { lat, lng },
    zoom: 15
  });
  new google.maps.Marker({ position: { lat, lng }, map });

  const locationURL = `https://maps.google.com/?q=${lat},${lng}`;

  firebase.database().ref("alerts").push({
    latitude: lat,
    longitude: lng,
    timestamp: new Date().toLocaleString()
  });

  emailjs
    .send(
      "service_shlhs0v",        
      "template_37d7eha",       
      {
        name: "Hardik",              
        time: new Date().toLocaleString(),  
        location_url: locationURL,          
        email: "csa152292@gmail.com"          
      }
    )
    .then(() => {
      statusMsg.textContent = "✅ Alert sent successfully!";
    })
    .catch(err => {
      console.error("EmailJS error:", err);
      statusMsg.textContent = "❌ Email failed – try again!";
    });

  qrBox.innerHTML = "";  
  new QRCode(qrBox, {
    text: locationURL,
    width: 160,
    height: 160
  });
}

function showError(error) {
  console.error("Geolocation error:", error);
  statusMsg.textContent = "⚠️ Unable to fetch your location.";
}
