# 💳 Flow: Custom Payment Flows Demo (Checkout.com)

This project demonstrates how to implement a custom card payment flow using [Checkout.com’s Flow](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-website/get-started-with-flow) with enhanced features like:

- ✅ `onTokenized` callback for card validation (e.g. block debit cards)
- ✅ `onCardBinChanged` to dynamically apply Mastercard markup
- ✅ `handleSubmit` to update Payment Session fields on the fly
- ✅ Custom discount handling with a user-friendly UI

> 🧪 Try it live: [https://flow-custompaymentflows.onrender.com/](https://flow-custompaymentflows.onrender.com/)

---

## 📦 Tech Stack

- Frontend: HTML + Tailwind CSS (via CDN) + Vanilla JS
- Backend: Node.js + Express
- Hosted on: [Render](https://render.com)
- Payments via: [Checkout.com Flow](https://www.checkout.com/docs/payments/accept-payments/accept-a-payment-on-your-website/get-started-with-flow)

---

## 🚀 Functionality Highlights

💡 Test these features in the live demo:

1. **❌ No debit cards allowed**  
   Try card number: `4659 1055 6905 1157` → You'll see an error message.

2. **🎁 Mastercard bonus**  
   Try card number: `5436 0310 3060 6378` → you’ll see a bonus message — “+50 loyalty points!”.

3. **🏷️ Discount support**  
   Enter the discount code: `flow` → A 10% discount is applied and the Payment Session updates in real time.

---

## 🧠 How It Works

- `server.js`: Node backend that handles:
  - Creating payment sessions (`/api/get-payment-session`)
  - Submitting payment sessions (`/api/submit-payment-session`)
- `public/index.html`: UI with Flow component + Total + Discount code input
- `public/script.js`: Logic to manage Flow integration, card validation, dynamic amount changes, and session updates

---

## 🛠️ Local Development

### 1. Clone the repo

```bash
git clone https://github.com/dmytro-anikin-cko/flow-customPaymentFlows.git
cd flow-customPaymentFlows
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create a .env file
```sh
CKO_SECRET_KEY=sk_sbox_your_key_here
```

4. Run locally

```bash
npm start
```

> Visit http://localhost:3000







