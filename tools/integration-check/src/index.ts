import path from 'node:path'
import { generateRouteDiff } from './routeDiff'
import { runSmokeTests } from './smoke'

const projectRoot = path.resolve(__dirname, '../../..')

async function main() {
  console.log('Generating route contract diff...')
  const diffResult = generateRouteDiff(projectRoot)
  console.log('Missing endpoints:', diffResult.missing.length)
  console.log('Extra endpoints:', diffResult.extra.length)
  console.log('Mismatched endpoints:', diffResult.mismatched.length)

  console.log('Running smoke tests against documented endpoints...')
  const results = await runSmokeTests(projectRoot)
  const attempted = results.filter((item) => item.attempted)
  const successes = attempted.filter((item) => item.ok)
  console.log(`Attempted ${attempted.length} endpoints, ${successes.length} succeeded.`)
}

main().catch((error) => {
  console.error('Integration check failed:', error)
  process.exitCode = 1
})
