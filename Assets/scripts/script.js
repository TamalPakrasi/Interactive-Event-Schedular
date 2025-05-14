$(document).ready(function () {
  console.log('script is running....');

  function datepickerWidthAdjust(input) {
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
      datepickerWidthAdjust(input);
    },
    onChangeMonthYear: function () {
      datepickerWidthAdjust($("#inputDate"));
    }
  });

  $('#inputTime').timepicker();

  $('[data-bs-dismiss="modal"]').click(function () {
    $('#eventModal input').val("");
  });
});