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

  const eventModalObserver = new MutationObserver((mutations) => {
    $.each(mutations, function (index, mutation) {
      if (mutation.attributeName === 'class') {
        const oldClasses = mutation.oldValue?.split(/\s+/) || [];
        const newClasses = eventModal.className.split(/\s+/);
        const removed = oldClasses.filter(cls => !newClasses.includes(cls));
        if (removed.includes('show')) {
          setTimeout(() => {
            $('#eventModal input').val("");
            $('#eventModal textarea').val("");
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
});