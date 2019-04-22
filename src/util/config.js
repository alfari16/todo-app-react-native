import moment from 'moment'
import PushNotification from 'react-native-push-notification'

moment.locale('id')
moment.calendarFormat = (myMoment, now) => {
  const diff = myMoment.diff(now, 'days', true)
  const nextMonth = now.clone().add(1, 'month')

  const retVal =
    diff < -6
      ? 'sameElse'
      : diff < -1
      ? 'lastWeek'
      : diff < 0
      ? 'lastDay'
      : diff < 1
      ? 'sameDay'
      : diff < 2
      ? 'nextDay'
      : diff < 7
      ? 'sameWeek'
      : diff < 14
      ? 'nextWeek'
      : // introduce thisMonth and nextMonth
      myMoment.month() === now.month() && myMoment.year() === now.year()
      ? 'thisMonth'
      : nextMonth.month() === myMoment.month() &&
        nextMonth.year() === myMoment.year()
      ? 'nextMonth'
      : 'nextLongMonth'
  return retVal
}
moment.updateLocale('id', {
  months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split(
    '_'
  ),
  weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
  calendar: {
    lastDay: '[Kemarin]',
    sameDay: '[Hari Ini]',
    nextDay: '[Besok]',
    sameWeek: '[Besok] dddd',
    lastWeek: 'dddd [minggu lalu]',
    nextWeek: 'dddd [minggu depan]',
    thisMonth: '[Bulan ini]',
    nextMonth: '[Bulan depan]',
    nextLongMonth: '[Beberapa bulan lagi]',
    sameElse: 'dddd, D MMMM YYYY'
  }
})

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function(token) {
    console.log('TOKEN:', token)
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: function(notification) {
    console.log('NOTIFICATION:', notification)

    // process the notification

    // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
    notification.finish(PushNotificationIOS.FetchResult.NoData)
  },

  // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
  // senderID: 'YOUR GCM (OR FCM) SENDER ID',

  // IOS ONLY (optional): default: all - Permissions to register.
  // permissions: {
  //   alert: true,
  //   badge: true,
  //   sound: true
  // },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   */
  requestPermissions: true
})