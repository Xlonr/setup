interface Config {
  name: string,
  entry: string,
  container: string,
  activeRule: string,
  props: {
    [key: string]: any
  }
}

import { registerMicroApps, start } from 'qiankun'

export function startQiankun () : void {
  const apps: Config[] = [
    {
      name: 'vue-app',
      entry: '//localhost:3030',
      container: '#container',
      activeRule: '/vue-app',
      props: {}
    },
    {
      name: 'qiankun-react',
      entry: '//localhost:3000',
      container: '#container',
      activeRule: '/react',
      props: {}
    }
  ]

  registerMicroApps(apps, {})

  start({
    prefetch: 'all'
  })
}
