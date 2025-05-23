import { defineConfig } from 'unocss'
import presetIcons from '@unocss/preset-icons'
import presetWind4 from '@unocss/preset-wind4'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetIcons(),

    presetWind4({
      reset: true
    })
  ],

  rules: [
    ['red', { background: 'red' }],

    ['drag', { 'app-region': 'drag' }],

    ['no-drag', { 'app-region': 'no-drag' }]
  ]
})
