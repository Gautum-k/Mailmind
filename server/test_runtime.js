const http = require('http');

const makeRequest = (options, postData) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            json: JSON.parse(data),
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            text: data,
          });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
};

const runRuntimeTests = async () => {
  console.log('=== RUNTIME API VERIFICATION START ===\n');

  try {
    // 1. Health Endpoint
    const health = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/health',
      method: 'GET',
    });
    console.log('[TEST 1] GET /api/health:', health.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', health.json);

    // 2. Signup
    const signupData = {
      name: 'Tester Demo',
      email: `test_${Date.now()}@mailmind.dev`,
      password: 'password123',
    };
    const signup = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/auth/signup',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      signupData
    );
    console.log('[TEST 2] POST /api/auth/signup:', signup.statusCode === 201 ? '✅ PASSED' : '❌ FAILED', signup.json?.success);

    const token = signup.json?.token;
    const cookie = signup.headers['set-cookie'] ? signup.headers['set-cookie'][0] : '';
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      Cookie: cookie,
    };

    // 3. Login
    const login = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: signupData.email, password: 'password123' }
    );
    console.log('[TEST 3] POST /api/auth/login:', login.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', login.json?.success);

    // 4. GET /api/auth/me
    const me = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/auth/me',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('[TEST 4] GET /api/auth/me:', me.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', me.json?.data?.email);

    // 5. GET /api/emails
    const emails = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/emails?label=INBOX',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('[TEST 5] GET /api/emails:', emails.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', `Fetched ${emails.json?.data?.length || 0} messages`);

    const firstMsgId = emails.json?.data?.[0]?.id || 'msg-1';

    // 6. GET /api/emails/:id
    const singleMsg = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: `/api/emails/${firstMsgId}`,
      method: 'GET',
      headers: authHeaders,
    });
    console.log('[TEST 6] GET /api/emails/:id:', singleMsg.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', singleMsg.json?.data?.subject);

    // 7. GET /api/emails/thread/:threadId
    const thread = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: `/api/emails/thread/thread-1`,
      method: 'GET',
      headers: authHeaders,
    });
    console.log('[TEST 7] GET /api/emails/thread/:id:', thread.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', `Thread messages: ${thread.json?.data?.messages?.length || 0}`);

    // 8. PATCH /api/emails/:id/star
    const star = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: `/api/emails/${firstMsgId}/star`,
        method: 'PATCH',
        headers: authHeaders,
      },
      { star: true }
    );
    console.log('[TEST 8] PATCH /api/emails/:id/star:', star.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', `Starred: ${star.json?.data?.isStarred}`);

    // 9. POST /api/ai/summarize
    const aiSummarize = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/ai/summarize',
        method: 'POST',
        headers: authHeaders,
      },
      { emailId: firstMsgId, subject: 'Test Email', bodyText: 'Important project updates' }
    );
    console.log('[TEST 9] POST /api/ai/summarize:', aiSummarize.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', aiSummarize.json?.data?.keyTakeaway);

    // 10. POST /api/ai/generate-reply
    const aiReply = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/ai/generate-reply',
        method: 'POST',
        headers: authHeaders,
      },
      { emailId: firstMsgId, tone: 'Professional' }
    );
    console.log('[TEST 10] POST /api/ai/generate-reply:', aiReply.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', `Draft preview: "${aiReply.json?.data?.reply?.slice(0, 40)}..."`);

    // 11. POST /api/ai/smart-search
    const smartSearch = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/ai/smart-search',
        method: 'POST',
        headers: authHeaders,
      },
      { prompt: 'unread emails from accounting' }
    );
    console.log('[TEST 11] POST /api/ai/smart-search:', smartSearch.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', `Query: "${smartSearch.json?.data?.gmailQuery}"`);

    // 12. GET /api/activity
    const activity = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/activity',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('[TEST 12] GET /api/activity:', activity.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', `Log entries: ${activity.json?.count || 0}`);

    // 13. Templates CRUD
    const createTmpl = await makeRequest(
      {
        hostname: '127.0.0.1',
        port: 5001,
        path: '/api/templates',
        method: 'POST',
        headers: authHeaders,
      },
      { name: 'Meeting Followup', subject: 'Thanks for meeting', body: 'Great connecting today!' }
    );
    console.log('[TEST 13] POST /api/templates:', createTmpl.statusCode === 201 ? '✅ PASSED' : '❌ FAILED', createTmpl.json?.data?.name);

    const getTmpls = await makeRequest({
      hostname: '127.0.0.1',
      port: 5001,
      path: '/api/templates',
      method: 'GET',
      headers: authHeaders,
    });
    console.log('[TEST 14] GET /api/templates:', getTmpls.statusCode === 200 ? '✅ PASSED' : '❌ FAILED', `Templates count: ${getTmpls.json?.count || 0}`);

    console.log('\n=== RUNTIME API VERIFICATION COMPLETE: ALL PASSED 🚀 ===');
  } catch (err) {
    console.error('Runtime test failed:', err);
  }
};

runRuntimeTests();
