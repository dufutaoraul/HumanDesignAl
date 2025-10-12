// 测试 undici ProxyAgent 是否工作
const { ProxyAgent, fetch: undiciFetch } = require('undici')

async function test() {
  console.log('Testing proxy connection...')

  const proxyAgent = new ProxyAgent('http://127.0.0.1:7897')

  try {
    const response = await undiciFetch('https://www.google.com', {
      dispatcher: proxyAgent
    })

    console.log('✅ Success! Status:', response.status)
    const text = await response.text()
    console.log('Response length:', text.length, 'bytes')
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
}

test()
