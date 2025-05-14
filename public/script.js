let selectedMethod = null;
let amountOverride;
const amount = 10000;
let paymentSession;
let discountCode = "";

const flowContainer = document.getElementById("flow-container");
const sessionStatus = document.getElementById("session-status");
const loader = document.getElementById("loader");
const payButton = document.getElementById("pay-button");
const totalDisplay = document.getElementById("total-display");
const discountInput = document.getElementById("discount-code");
const discountButton = document.getElementById("apply-discount");


const loyaltyMessage = document.getElementById("loyalty-message");

function showLoyaltyMessage(text) {
  loyaltyMessage.textContent = text;
  loyaltyMessage.classList.remove("hidden");
}

function hideLoyaltyMessage() {
  loyaltyMessage.textContent = "";
  loyaltyMessage.classList.add("hidden");
}

// Discount Logic
const applyDiscountAndUpdateTotal = () => {
  discountCode = discountInput.value.trim().toLowerCase();

  const isValidDiscount = discountCode === "flow";
  const discountFactor = isValidDiscount ? 0.9 : 1;

  amountOverride = Math.round(amount * discountFactor);
  const euroAmount = (amountOverride / 100).toFixed(2);

  totalDisplay.textContent = `€${euroAmount}`;

  // Disable the button and show success
  if (isValidDiscount) {
    discountButton.disabled = true;
    discountButton.classList.add("bg-slate-600", "cursor-default");
    discountButton.textContent = "Applied ✅";
    discountInput.disabled = true;
  }
};

// Apply discount on click
discountButton.addEventListener("click", applyDiscountAndUpdateTotal);

// Trigger Apply Discount on Enter
discountInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    discountButton.click();
  }
});

// Requesting a Payment Session on page load
(async () => {
  const createPaymentSession = async () => {
    try {
      const response = await fetch("/api/get-payment-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
        }),
      });
      return response.json();
    } catch (error) {
      console.error("❌ Error fetching payment session:", error);
      loader.innerHTML = `<span class="text-red-600">❌ Network error while loading payment session.</span>`;
      return null;
    }
  };
  loader.classList.remove("hidden");
  paymentSession = await createPaymentSession();

  if (!paymentSession || !paymentSession.id) {
    loader.innerHTML = `<span class="text-red-600">❌ Failed to initialize a valid payment session.</span>`;
    return;
  }

  loader.classList.add("hidden");
  sessionStatus.textContent = `✅ Your Payment Session ID is: ${paymentSession.id}`;
  sessionStatus.classList.remove("hidden");

  initFlow();
})();

// A function that submits the Payment Session
const performPaymentSubmission = async (submitData) => {
  try {
    const response = await fetch("/api/submit-payment-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });
    return response.json();
  } catch (error) {
    console.error("❌ Submit error:", error);
  }
};

const initFlow = async () => {
  // Guarding initFlow against missing session
  if (!paymentSession || !paymentSession.id) {
    alert("Payment session not ready yet. Please wait...");
    return;
  }

  let checkout = await CheckoutWebComponents({
    publicKey: "pk_sbox_guri7tp655hvceb3qaglozm7gee",
    paymentSession,
    onError: (_, error) => console.error(error),
    onTokenized: (_self, tokenizeResult) => {
      // perform any additional checks
      if (tokenizeResult.cardMetadata.card_type === "debit") {
        return {
          continue: false,
          errorMessage: "Debit cards are not accepted.",
        };
      }
      return { continue: true };
    },
    onCardBinChanged: (_self, cardMetadata) => {
      console.log(cardMetadata);
      selectedMethod = cardMetadata?.scheme || null;

      if (selectedMethod === "mastercard") {
        showLoyaltyMessage(
          "🎁 You're using a Mastercard! You’ll earn +50 loyalty points."
        );
      } else {
        hideLoyaltyMessage();
      }
    },
    onPaymentCompleted: (_self) => {
      payButton.textContent = "Payment Complete ✅";
      payButton.disabled = true;
      payButton.classList.add("bg-green-600", "cursor-default");
    },
    onSubmit: (_self) => {
      payButton.textContent = "Processing...";
      payButton.disabled = true;
      payButton.classList.add("bg-gray-600", "cursor-default");
    },
    handleSubmit: async (_self, { session_data }) => {
      return performPaymentSubmission({
        amount: amountOverride,
        session_data,
        paymentSessionId: paymentSession.id,
      });
    },
    showPayButton: false,
    environment: "sandbox",
  });

  const component = checkout.create("flow");

  console.log("Flow Component", component);

  if (await component.isAvailable()) {
    console.log("Available✅");
    component.mount(flowContainer);
  } else {
    console.log("Not Available❌");
  }

  /* Custom PAY button */

  payButton.addEventListener("click", () => {
    if (component.isValid()) {
      component.submit();
    }
  });
};
