function setupRealtimeValidation() {
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput  = document.getElementById("lastName");
  const emailInput     = document.getElementById("email");
  const addressInput   = document.getElementById("address");

  if (firstNameInput) {
    firstNameInput.addEventListener("input", () => validateName(firstNameInput, "Vardas"));
    firstNameInput.addEventListener("blur",  () => validateName(firstNameInput, "Vardas"));
  }

  if (lastNameInput) {
    lastNameInput.addEventListener("input", () => validateName(lastNameInput, "Pavardė"));
    lastNameInput.addEventListener("blur",  () => validateName(lastNameInput, "Pavardė"));
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => validateEmail(emailInput));
    emailInput.addEventListener("blur",  () => validateEmail(emailInput));
  }

  if (addressInput) {
    addressInput.addEventListener("input", () => validateAddress(addressInput));
    addressInput.addEventListener("blur",  () => validateAddress(addressInput));
  }
    const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", handlePhoneInput);
  }

}

function validateName(input, labelText) {
  const value = input.value.trim();

  if (!value) {
    showError(input, labelText + " privalomas");
    return false;
  }

  const nameRegex = /^[A-Za-zĀČĖĘĮŠŲŪŽāčėęįšųūžÀ-ž\s'-]+$/;

  if (!nameRegex.test(value)) {
    showError(input, labelText + " turi būti sudarytas tik iš raidžių");
    return false;
  }

  clearError(input);
  return true;
}

function validateEmail(input) {
  const value = input.value.trim();

  if (!value) {
    showError(input, "El. paštas privalomas");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    showError(input, "Įveskite teisingą el. pašto adresą");
    return false;
  }

  clearError(input);
  return true;
}

function validateAddress(input) {
  const value = input.value.trim();

  if (!value) {
    showError(input, "Adresas privalomas");
    return false;
  }

  const onlyDigits = /^\d+$/;
  if (onlyDigits.test(value)) {
    showError(input, "Adresas turi būti tekstas, ne tik skaičiai");
    return false;
  }

  clearError(input);
  return true;
}
function handlePhoneInput(event) {
  const input = event.target;


  let digits = input.value.replace(/\D/g, "");


  if (digits.startsWith("370")) {
    digits = digits.slice(3);
  }

  if (digits.length > 8) {
    digits = digits.slice(0, 8);
  }

  if (digits.length === 0) {
    input.value = "";
    return;
  }

  const firstPart = digits.slice(0, 3);
  const secondPart = digits.slice(3);

  let formatted = "+370 " + firstPart;
  if (secondPart) {
    formatted += " " + secondPart;
  }

  input.value = formatted;
}


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const formMessage = document.getElementById("form-message");
  const formOutput = document.getElementById("form-output");

  initRangeLabels();
  setupRealtimeValidation();

  if (!form) {
    console.error("Nerasta forma su id='contact-form'");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

       const firstNameInput = document.getElementById("firstName");
    const lastNameInput  = document.getElementById("lastName");
    const emailInput     = document.getElementById("email");
    const phoneInput     = document.getElementById("phone");
    const addressInput   = document.getElementById("address");

    const firstName = firstNameInput.value.trim();
    const lastName  = lastNameInput.value.trim();
    const email     = emailInput.value.trim();
    const phone     = phoneInput.value.trim();
    const address   = addressInput.value.trim();

    const q1 = Number(document.getElementById("q1").value);
    const q2 = Number(document.getElementById("q2").value);
    const q3 = Number(document.getElementById("q3").value);

    let isValid = true;

    if (!validateName(firstNameInput, "Vardas"))  isValid = false;
    if (!validateName(lastNameInput, "Pavardė"))  isValid = false;
    if (!validateEmail(emailInput))               isValid = false;
    if (!validateAddress(addressInput))           isValid = false;

    const phonePattern = /^\+370\s6\d{2}\s\d{5}$/;

    if (!phonePattern.test(phone)) {
      showError(phoneInput, "Telefono numeris turi būti formatu +370 6xx xxxxx");
      isValid = false;
    } else {
      clearError(phoneInput);
    }


    if (!isValid) {
      formMessage.textContent = "Pataisykite klaidas formoje.";
      formMessage.style.color = "red";
      return;
    }

    const formData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      address: address,
      ratings: {
        design: Number(q1),
        content: Number(q2),
        usability: Number(q3)
      }
    };
    const average = (Number(q1) + Number(q2) + Number(q3)) / 3;
    const averageFormatted = average.toFixed(1);

    console.log("Formos duomenų objektas:", formData);

    if (formOutput) {
      formOutput.innerHTML = `
        <p>Vardas: ${formData.firstName}</p>
        <p>Pavardė: ${formData.lastName}</p>
        <p>El. paštas: ${formData.email}</p>
        <p>Tel. numeris: ${formData.phone}</p>
        <p>Adresas: ${formData.address || "-"}</p>
        <p>CV dizaino įvertinimas: ${formData.ratings.design}/10</p>
        <p>Turinio aiškumo įvertinimas: ${formData.ratings.content}/10</p>
        <p>Naudojimo patogumo įvertinimas: ${formData.ratings.usability}/10</p>
      `;
      formOutput.innerHTML += `
        <hr>
        <p><strong>${formData.firstName} ${formData.lastName}:</strong> ${averageFormatted}</p>
      `;
      formMessage.textContent = "Forma sėkmingai apdorota. Duomenys parodyti žemiau.";
      formMessage.style.color = "lime";

      showSuccessPopup();

    }
  });
});

function initRangeLabels() {
  const items = [
    { inputId: "q1", labelId: "q1-value" },
    { inputId: "q2", labelId: "q2-value" },
    { inputId: "q3", labelId: "q3-value" }
  ];

  items.forEach(item => {
    const input = document.getElementById(item.inputId);
    const label = document.getElementById(item.labelId);

    if (!input || !label) return;

    label.textContent = input.value;

    input.addEventListener("input", function () {
      label.textContent = input.value;
    });
  });
}

////////////////////////
function showSuccessPopup() {
  const popup = document.getElementById("success-popup");
  const closeBtn = document.getElementById("success-popup-close");

  if (!popup) return;
  popup.classList.add("visible");

  if (closeBtn) {
    closeBtn.onclick = function () {
      popup.classList.remove("visible");
    };
  }

  setTimeout(function () {
    popup.classList.remove("visible");
  }, 3000);
}

function showError(input, message) {
  input.classList.add("input-error");

  let errorSpan = input.parentElement.querySelector(".error-message");
  if (!errorSpan) {
    errorSpan = document.createElement("span");
    errorSpan.classList.add("error-message");
    input.parentElement.appendChild(errorSpan);
  }
  errorSpan.textContent = message;
}

function clearError(input) {
  input.classList.remove("input-error");
  const errorSpan = input.parentElement.querySelector(".error-message");
  if (errorSpan) {
    errorSpan.textContent = "";
  }
}
