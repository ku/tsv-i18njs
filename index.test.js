
const rewire = require('rewire')

let TsvI18njs = null
let fsmock = null

beforeEach( () => {
  TsvI18njs = rewire('./index')

  fsmock = {
    writeFileSync: jest.fn()
  }

})

test('generates', () => {
  const src = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUUk1_F-VxePs-exsB6R2F3fVIcAdxRRVLxgxz0uV4_Y0xPFDfMrLjvMAHQeYO4EXelqaJ2fgiNmF2/pub?output=tsv';

  TsvI18njs.__set__('fs', fsmock)
  const path = './tmp'
  return (new TsvI18njs(src, 'utf-8', 'node')).convert(path).then( (errors) => {
    expect(fsmock.writeFileSync.mock.calls.length).toEqual(3)

    {
      expect(fsmock.writeFileSync.mock.calls[0][0]).toEqual(path + '/en_US.js')
      const f = new Function('module', fsmock.writeFileSync.mock.calls[0][1])
      const module = {}
      f(module)
      expect(module.exports).toEqual({
        screen: {
          welcome: {
            hello: 'Hello'
          }
        },
        currency_sign: '$',
        ok: 'OK',
        cancel: 'Cancel',
      })
    }

    {
      expect(fsmock.writeFileSync.mock.calls[1][0]).toEqual(path + '/ja_JP.js')
      const f = new Function('module', fsmock.writeFileSync.mock.calls[1][1])
      const module = {}
      f(module)
      expect(module.exports).toEqual({
        screen: {
          welcome: {
            hello: 'こんにちは'
          }
        },
        currency_sign: '¥',
        counter_word: '個',
        ok: 'OK',
        cancel: 'キャンセル',
      })
    }

    {
      expect(fsmock.writeFileSync.mock.calls[2][0]).toEqual(path + '/zh_CN.js')
      const f = new Function('module', fsmock.writeFileSync.mock.calls[2][1])
      const module = {}
      f(module)
      expect(module.exports).toEqual({
        screen: {
          welcome: {
            hello: '你好'
          }
        },
        currency_sign: '¥',
        counter_word: '個',
        ok: 'OK',
        cancel: '取消',
      })
    }

    expect(errors).toBe(1)
  })
})
