// End-to-end check of Steps 3 + 4: recall from Hindsight -> review with Groq.
const { recallMemories } = require('./hindsight');
const { reviewCode, MODEL } = require('./agent');

const code = `public class UserService {
    public String getUserEmail(User user) {
        return user.getEmail().toLowerCase();
    }
}`;

(async () => {
  console.log('Model:', MODEL);
  const recalled = await recallMemories(code);
  console.log('\nMemories recalled:', recalled.memories);

  const review = await reviewCode(code, recalled.memories);
  console.log('\nReview:\n', JSON.stringify(review, null, 2));
})();
