// Quick check that Hindsight works: store two insights, then recall them.
const { recallMemories, retainInsights, BANK_ID } = require('./hindsight');

(async () => {
  console.log('Bank:', BANK_ID);

  console.log('\n1) Retaining test insights...');
  const stored = await retainInsights([
    'The developer frequently forgets null validation on method parameters.',
    'The developer prefers meaningful variable names over single letters.',
  ]);
  console.log(stored);

  console.log('\n2) Recalling for a null-related snippet...');
  const recalled = await recallMemories('public String getName(User u) { return u.getName().trim(); }');
  console.log(recalled);
})();
