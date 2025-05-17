document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto', // makes it responsive
    selectable: true,
    dateClick: function(info) {
      console.log(12);
    },
    editable: true,
  });
  calendar.render();
})