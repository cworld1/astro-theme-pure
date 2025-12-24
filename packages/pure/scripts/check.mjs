import { exec } from 'node:child_process'

const runCommand = (command, cwd, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const child = exec(command, { cwd, timeout }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${stderr}`)
      } else {
        resolve(stdout)
      }
    })

    child.on('error', (error) => {
      reject(`Execution error: ${error.message}`)
    })

    child.on('exit', (code) => {
      if (code !== 0) {
        reject(`Command exited with code ${code}`)
      }
    })
  })
}

export default async function main() {
  if (process.env.BUN_LINK_PKG === 'true') {
    try {
      console.log('Running "bun link" at "./packages/pure"')
      console.log(await runCommand('bun link', './packages/pure'))
      console.log('Running "bun link astro-pure" at "."')
      console.log(await runCommand('bun link astro-pure', '.'))
      console.log('Commands executed successfully.')
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log('BUN_LINK_PKG is not set to true. Skipping commands.')
  }
}
