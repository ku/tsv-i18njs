#!/usr/bin/env node

const TsvI18njs = require('../index')


class Main {
  showUsage() {
    console.error('Usage: tsv-i18njs source output_dir [--format=es|node]')
    return process.exit(-1)
  }

  constructor(args) {
    const f = ( s => s.match(/^--?/) )
    this.options = args.filter(f)
    this.args = args.filter( s => !f(s) )
  }

  run() {
    if (this.args.length !== 2) {
      return this.showUsage()
    }

    const src = this.args[0]
    const dst = this.args[1]

    const format = this.options.find( opt => opt.match(/--format=es/) ) ? 'es' : 'node'

    return (new TsvI18njs(src, 'utf-8', format)).convert(dst)
  }
}

(new Main(process.argv.slice(2))).run().then( (errors) => {
  process.exit(errors)
})
