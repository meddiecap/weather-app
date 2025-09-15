
// Disable websockets for tests to avoid "WebSocket is not defined" errors
process.env.NUXTHUB_DISABLE_WEBSOCKET = 'true'

if (process.env.TEST_USE_DISK_DB) {
  process.env.NITRO_DATABASE_URL = `file:./test-${Date.now()}.db`
} else {
  process.env.NITRO_DATABASE_URL = 'file::memory:?cache=shared'
}