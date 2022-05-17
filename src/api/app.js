const os = require('os')

const cpu = () => {
	try {
		// Take the first CPU, considering every CPUs have the same specs
		// and every NodeJS process only uses one at a time.
		const cpus = os.cpus()
		const cpu = cpus[0]

		// Accumulate every CPU times values
		const total = Object.values(cpu.times).reduce((acc, tv) => acc + tv, 0)

		// Normalize the one returned by process.cpuUsage()
		// (microseconds VS miliseconds)
		const usage = process.cpuUsage()
		const currentCPUUsage = (usage.user + usage.system) * 1000

		// Find out the percentage used for this specific CPU
		const perc = currentCPUUsage / total * 100
		return perc
		console.log(`CPU Usage (%): ${perc}`)
		return cpus
		// console.log(os.cpus())
		// console.log(os.totalmem())
		// console.log(os.freemem())
	} catch (e) {
		console.error(e)
	}
}

const qurrythis = require("../core/db")
	
const callback = (sql)=> {
try {
return await qurrythis(sql)
	} catch (e) {
		console.log('Error in callback function ' + e)
		return e
	}
}


module.exports = { cpu,callback}
