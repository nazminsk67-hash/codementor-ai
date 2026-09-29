// Sends two DIFFERENT Java snippets with the same null-validation mistake.
// Run while the server is running in another terminal.
const URL = `http://localhost:${process.env.PORT || 3000}/api/review`;

const samples = [
`public class UserService {
    public String getUserEmail(User user) {
        return user.getEmail().toLowerCase();
    }
}`,
`public class OrderService {
    public double calculateTotal(Order order) {
        double total = 0;
        for (Item item : order.getItems()) {
            total += item.getPrice() * item.getQuantity();
        }
        return total;
    }
}`,
];

(async () => {
  for (let i = 0; i < samples.length; i++) {
    console.log(`\n=========== Review ${i + 1} ===========`);
    const res = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: samples[i] }),
    });
    const data = await res.json();
    if (!res.ok) { console.log('ERROR', res.status, data); continue; }
    console.log('Memory status  :', data.memoryStatus);
    console.log('Memory used    :', data.memoryUsed);
    console.log('Top issue      :', data.issues[0]);
    console.log('Memory insights:', data.memoryInsights);
    console.log('Memory learned :', data.memoryLearned);
  }
})();
