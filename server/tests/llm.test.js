process.env.LLM_RATE_LIMIT = '3';
const { queryLLM } = require('../utils/llm');

test('mock llm returns structured response', async () => {
  const res = await queryLLM({ userId: 'test', question: 'How to solve 2+2?' });
  expect(res).toHaveProperty('answer');
  expect(Array.isArray(res.steps)).toBe(true);
  expect(Array.isArray(res.hints)).toBe(true);
});

test('rate limiter blocks after limit', async () => {
  const limit = 3;
  // call queryLLM limit times
  for (let i = 0; i < limit; i++) {
    await queryLLM({ userId: 'ratetest', question: 'x' });
  }
  // Next call should throw RATE_LIMIT
  let thrown = false;
  try { await queryLLM({ userId: 'ratetest', question: 'x' }); } catch (e) { thrown = true; expect(e.code).toBe('RATE_LIMIT'); }
  expect(thrown).toBe(true);
});
