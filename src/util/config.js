import moment from 'moment'

moment.locale('id')
moment.updateLocale('id', {
  months: 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split(
    '_'
  ),
  weekdays: 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
  calendar: {
    lastDay: '[Kemarin]',
    sameDay: '[Hari Ini]',
    nextDay: '[Besok]',
    lastWeek: 'dddd, D MMMM YYYY',
    nextWeek: 'dddd, D MMMM YYYY',
    sameElse: 'dddd, D MMMM YYYY'
  }
})
