console.log("CodeMentor AI frontend loaded successfully.");

// Demo Java code
const demoCodes = {
    1: `public class UserService {

    public String getUserEmail(User user) {
        return user.getEmail().toLowerCase();
    }

    static class User {
        private String email;

        public User(String email) {
            this.email = email;
        }

        public String getEmail() {
            return email;
        }
    }
}`,

    2: `public class UserService {

    public String getUserEmail(User user) {
        return user.getEmail().toLowerCase();
    }

    static class User {
        private String email;

        public User(String email) {
            this.email = email;
        }

        public String getEmail() {
            return email;
        }
    }
}`,

    3: `public class PaymentService {

    public String processPayment(User user, Payment payment) {

        String email = user.getEmail().toLowerCase();

        if (payment.getAmount() > 0) {
            System.out.println("Payment successful");
        }

        return email;
    }

    static class User {
        private String email;

        public String getEmail() {
            return email;
        }
    }

    static class Payment {
        private double amount;

        public double getAmount() {
            return amount;
        }
    }
}`
};


// Find the Java code textarea
const codeInput = document.querySelector("textarea");


// Find all buttons
const buttons = document.querySelectorAll("button");

console.log("Buttons found:", buttons.length);


// Demo buttons
buttons.forEach((button) => {

    const text = button.innerText.trim();

    if (text.includes("1. Load Demo Code")) {
        button.addEventListener("click", () => {
            codeInput.value = demoCodes[1];
            console.log("Demo 1 loaded");
        });
    }

    if (text.includes("2. Load Demo Code")) {
        button.addEventListener("click", () => {
            codeInput.value = demoCodes[2];
            console.log("Demo 2 loaded");
        });
    }

    if (text.includes("3. Load Demo Code")) {
        button.addEventListener("click", () => {
            codeInput.value = demoCodes[3];
            console.log("Demo 3 loaded");
        });
    }

    if (text === "Review Code") {
        button.addEventListener("click", reviewCode);
    }
});


// Review function
async function reviewCode() {

    const code = codeInput.value.trim();

    if (!code) {
        alert("Please enter Java code first.");
        return;
    }

    console.log("Reviewing code...");

    // Find/create result section
    let resultBox = document.getElementById("reviewResult");

    if (!resultBox) {
        resultBox = document.createElement("div");
        resultBox.id = "reviewResult";

        resultBox.style.marginTop = "20px";
        resultBox.style.padding = "20px";
        resultBox.style.border = "1px solid #444";
        resultBox.style.borderRadius = "10px";
        resultBox.style.background = "#111820";
        resultBox.style.color = "#ffffff";

        codeInput.parentElement.appendChild(resultBox);
    }

    resultBox.innerHTML = "<h3>Reviewing code...</h3>";

    try {

        const response = await fetch("http://localhost:3000/api/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                code: code
            })
        });

        const data = await response.json();

        console.log("Backend response:", data);

        if (!response.ok) {
            throw new Error(data.error || "Review failed");
        }

        resultBox.innerHTML = `
            <h3>Code Review</h3>
            <pre style="
                white-space: pre-wrap;
                font-family: Arial, sans-serif;
                line-height: 1.6;
            ">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        `;

    } catch (error) {

        console.error("Review error:", error);

        resultBox.innerHTML = `
            <h3>❌ Review Error</h3>
            <p>${escapeHtml(error.message)}</p>
            <p>
                Make sure the backend is running at
                <strong>http://localhost:3000</strong>
            </p>
        `;
    }
}


// Prevent HTML from being interpreted inside result
function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}