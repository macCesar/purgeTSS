import updateNotifier from 'update-notifier'

updateNotifier({
  pkg: {
    name: 'purgetss',
    version: '2.0.0'
  },
  updateCheckInterval: 0
}).notify()
