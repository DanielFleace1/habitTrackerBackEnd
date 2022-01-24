
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
//const logger = require('./utils/logger')
const daysRouter = require('./controllers/daysRouter')

app.use('/api/data',daysRouter)

//APP LISTEN
const PORT = 3001
app.listen(PORT,() => {
  console.log(`Server running on port ${PORT}`);
})