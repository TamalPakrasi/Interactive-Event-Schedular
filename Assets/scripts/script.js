$(document).ready(function () {
  console.log('script is running....');

  function dateTimepickerWidthAdjust(input) {
    const inputWidth = $(input).outerWidth();
    setTimeout(() => {
      $("#ui-datepicker-div").css({
        width: inputWidth + "px"
      });
    }, 0);
  }

  $("#inputDate").datepicker({
    showButtonPanel: true,
    dateFormat: "dd-mm-yy",
    beforeShow: function (input) {
      dateTimepickerWidthAdjust(input);
    },
    onChangeMonthYear: function () {
      dateTimepickerWidthAdjust($("#inputDate"));
    }
  });

  $('#inputTime').timepicker({
    beforeShow: function (input) {
      dateTimepickerWidthAdjust(input);
    },
  });

  const eventModal = $('#eventModal')[0];
  const eventModalObj = new bootstrap.Modal(eventModal);

  const eventModalObserver = new MutationObserver((mutations) => {
    $.each(mutations, function (index, mutation) {
      if (mutation.attributeName === 'class') {
        const oldClasses = mutation.oldValue?.split(/\s+/) || [];
        const newClasses = eventModal.className.split(/\s+/);
        const removed = oldClasses.filter(cls => !newClasses.includes(cls));
        if (removed.includes('show')) {
          setTimeout(() => {
            $('#eventModal .form-control').val("");
            // $('#eventModal textarea').val("");
            const defaultOption = $('#eventModal select').children().first();
            defaultOption.prop('selected', true);
          }, 500);
        }
      }
    });
  })

  eventModalObserver.observe(eventModal, {
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true
  })

  function isLeapYear(year) {
    return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
  }

  function checkEventDateFormat() {
    const value = $('#inputDate').val().trim();
    if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return null;

    const [dd, mm, yyyy] = value.split('-');
    const day = parseInt(dd, 10);
    const month = parseInt(mm, 10);
    const year = parseInt(yyyy, 10);

    if (day < 1 || day > 31 || month < 1 || month > 12) return null;

    if (month === 2 && day > 29) return null; 
    if (month === 2 && day === 29 && !isLeapYear(year)) return null;
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (day > 30) return null;
    }

    return value;
  }

  function checkEventTimeFormat() {
    const value = $('#inputTime').val().trim();
    if (!/^\d{2}:\d{2}/.test(value)) return null;

    const [hh, mm] = value.split(':');
    const hours = parseInt(hh, 10);
    const mins = parseInt(mm, 10);

    if (hours < 0 || mins < 0 ) return null;
    return value;
  }

  function validateCatagory() {
    const value = $('#inputCatagorySelect').find('option:selected').text();
    const defaultOptionText = $('#eventModal select').children().first().text();
    if (value === defaultOptionText) return null;
    return value;
  }

  const alertModalObj = new bootstrap.Modal('#alertModal');

  $('#save-event-data').click(function () {
    const title = $('#inputTitle').val().trim();
    const date = checkEventDateFormat();
    const time = checkEventTimeFormat();
    const catagory = validateCatagory();
    const location = $('#inputLocation').val().trim();
    const description = $('#inputDescription').val().trim();

    if (!title || !date || !time || !catagory || !location) {
      alertModalObj.show();
      eventModalObj.hide();
      setTimeout(() => {
        alertModalObj.hide();
      }, 5000);
      return;
    }
    eventModalObj.hide();
  });

});