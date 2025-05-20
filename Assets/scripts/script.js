$(document).ready(function () {
  console.log('script is running....');

  const bootstrapColors = {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    dark: '#212529'
  };

  function dateTimepickerWidthAdjust(input) {
    const inputWidth = $(input).outerWidth();
    setTimeout(() => {
      $("#ui-datepicker-div").css({
        width: inputWidth + "px"
      });
    }, 0);
  }

  $("#inputStartDate").datepicker({
    showButtonPanel: true,
    dateFormat: "dd-mm-yy",
    beforeShow: function (input) {
      dateTimepickerWidthAdjust(input);
    },
    onChangeMonthYear: function () {
      dateTimepickerWidthAdjust($("#inputDate"));
    }
  });

  $("#inputEndDate").datepicker({
    showButtonPanel: true,
    dateFormat: "dd-mm-yy",
    beforeShow: function (input) {
      dateTimepickerWidthAdjust(input);
    },
    onChangeMonthYear: function () {
      dateTimepickerWidthAdjust($("#inputDate"));
    }
  });

  $('#inputStartTime').timepicker({
    beforeShow: function (input) {
      dateTimepickerWidthAdjust(input);
    },
  });

  $('#inputEndTime').timepicker({
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
            $('#inputEndTime').attr('disabled', '');
            $('#inputEndDate').attr('disabled', '');
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

  function checkEventDateFormat(point) {
    const value = $(`#input${point}Date`).val().trim();
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

  function checkEventTimeFormat(point) {
    const value = $(`#input${point}Time`).val().trim();
    if (!/^\d{2}:\d{2}/.test(value)) return null;

    const [hh, mm] = value.split(':');
    const hours = parseInt(hh, 10);
    const mins = parseInt(mm, 10);

    if (hours < 0 || mins < 0) return null;
    return value;
  }

  $('#inputStartTime').change(function () {
    if (!$('#inputEndTime').val().length && ($(this).val().length === 5 || !$(this).val().length)) {
      $('#inputEndTime').removeAttr('disabled');
      $('#inputEndTime').val($(this).val());
    }
  })

  $('#inputStartDate').change(function () {
    if (!$('#inputEndDate').val().length && ($(this).val().length === 10 || !$(this).val().length)) {
      $('#inputEndDate').removeAttr('disabled');
      $('#inputEndDate').val($(this).val());
    }
  })

  function validateCatagory() {
    const value = $('#inputCatagorySelect').find('option:selected').text();
    const defaultOptionText = $('#eventModal select').children().first().text();
    if (value === defaultOptionText) return null;
    return value;
  }

  function validDateSpan(startDate, endDate) {
    const startDateArr = startDate.split('-');
    const [sd, sm, sy] = startDateArr;
    const startDateDay = new Date(`${sy}-${sm}-${sd}`);
    startDateDay.setHours(0, 0, 0, 0);

    const endDateArr = endDate.split('-');
    const [ed, em, ey] = endDateArr;
    const endDateDay = new Date(`${ey}-${em}-${ed}`);
    endDateDay.setHours(0, 0, 0, 0);

    const arr1 = [false, 'lesser'];
    const arr2 = [true, 'greater'];
    const arr3 = [true, 'same'];

    if (endDateDay < startDateDay) return [...arr1];
    else if (endDateDay > startDateDay) return [...arr2];
    else if (
      startDateDay.getFullYear() === endDateDay.getFullYear() &&
      startDateDay.getMonth() === endDateDay.getMonth() &&
      startDateDay.getDate() === endDateDay.getDate()
    ) return [...arr3];
  }

  function validTimeSpan(startTime, endTime, startDate, endDate) {
    const isValidDate = Array.from(validDateSpan(startDate, endDate));
    if (isValidDate[1] === 'greater') return true;

    const startHours = parseInt(startTime.split(':')[0], 10);
    const endHours = parseInt(endTime.split(':')[0], 10);

    if (startHours > endHours) return false;
    else if (startHours <= endHours) return true;
  }

  const alertModalObj = new bootstrap.Modal('#alertModal');

  const eventDataModal = $('#eventDataModal')[0];
  const eventDataModalObj = new bootstrap.Modal(eventDataModal);

  const eventModalDataObserver = new MutationObserver((mutations) => {
    $.each(mutations, function (index, mutation) {
      if (mutation.attributeName === 'class') {
        const oldClasses = mutation.oldValue?.split(/\s+/) || [];
        const newClasses = eventDataModal.className.split(/\s+/);
        const removed = oldClasses.filter(cls => !newClasses.includes(cls));
        if (removed.includes('show')) {
          setTimeout(() => {
            $('#eventDataModal .form-control').val("");
          }, 500);
        }
      }
    });
  })

  eventModalDataObserver.observe(eventDataModal, {
    attributes: true,
    attributeFilter: ['class'],
    attributeOldValue: true
  })


  function formatChangeforDate(date) {
    const localDateStr = new Date(date).toLocaleDateString('en-US')
    const dateArr = localDateStr.split('/');
    const [month, day, year] = dateArr;
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year.padStart(4, '0')}`;
  }

  function loadEventsFromStorage() {
    return JSON.parse(localStorage.getItem('event-data') ?? '[]');
  }

  function addEventToLocalStorage(event) {
    const arr = loadEventsFromStorage();
    arr.push(event);
    localStorage.setItem('event-data', JSON.stringify(arr));
  }

  function viewEvent(event) {
    $('#outputTitle').val(event.title);
    $('#outputStartDate').val(event.extendedProps.startDate);
    $('#outputEndDate').val(event.extendedProps.endDate);
    $('#outputStartTime').val(event.extendedProps.startTime);
    $('#outputEndTime').val(event.extendedProps.endTime);
    $('#outputCatagory').val(event.extendedProps.catagory);
    $('#outputLocation').val(event.extendedProps.location);
    $('#outputDescription').val(event.extendedProps.desc);
  }

  function RemoveEventFromStorage(id) {
    const eventArr = loadEventsFromStorage();
    const updatedEventArr = eventArr.filter((event) => event.id !== id)
    localStorage.setItem('event-data', JSON.stringify(updatedEventArr));
  }

  function deleteEvent(id) {
    const event = calendar.getEventById(id);
    RemoveEventFromStorage(id);
    if (event) event.remove();
    eventDataModalObj.hide();
  }

  function editEventDataInStorage(newData, id) {
    const eventArr = loadEventsFromStorage();
    $.each(eventArr, function (index, eachEvent) {
      if (eachEvent.id === id) {
        eachEvent.title = newData[0];
        eachEvent.start = ISOformat(newData[1], 'start');
        eachEvent.end = ISOformat(newData[2], 'end');
        eachEvent.extendedProps.startDate = newData[1];
        eachEvent.extendedProps.endDate = newData[2];
        eachEvent.extendedProps.startTime = newData[3];
        eachEvent.extendedProps.endTime = newData[4];
        eachEvent.extendedProps.location = newData[5];
        eachEvent.extendedProps.desc = newData[6];
        eachEvent.extendedProps.catagory = newData[7];
      }
    });
    localStorage.setItem('event-data', JSON.stringify(eventArr));
  }

  function getNewData(button) {
    const arr = [];
    const allInputs = Array.from($(button).parent().prev().find('input.seconadry-nav-select'));
    $.each(allInputs, function (index, input) {
      arr.push($(input).val());
    });
    const descAreaText = $(button).parent().prev().find('textArea.seconadry-nav-select').val();
    arr.push(descAreaText);
    const selectValue = $(button).parent().prev().find('select.form-select').find('option:selected').text();
    arr.push(selectValue);
    return [...arr];
  }

  function editEvent(id, button) {
    const event = calendar.getEventById(id);
    const newData = getNewData(button);
    editEventDataInStorage(JSON.parse(JSON.stringify(newData)), id);
    if (event) {
      event.setProp('title', newData[0]);
      event.setStart(ISOformat(newData[1], 'start'));
      event.setEnd(ISOformat(newData[2], 'end'));
      event.setExtendedProp('startDate', newData[1]);
      event.setExtendedProp('endDate', newData[2]);
      event.setExtendedProp('startTime', newData[3]);
      event.setExtendedProp('endTime', newData[4]);
      event.setExtendedProp('location', newData[5]);
      event.setExtendedProp('desc', newData[6]);
      event.setExtendedProp('catagory', newData[7]);
    }
    const selectedCatText = $('#CatagorieSelect').find('option:selected').text();
    checkSelectedCatagory(selectedCatText);
    eventDataModalObj.hide();
  }

  function changeCatagory(catagory) {
    const allOptions = Array.from($('#inputCatagorySelect').children());
    const mainOptions = allOptions.filter((option) => !($(option).text() === 'Select a catagory'));
    $.each(mainOptions, function (index, option) {
      if ($(option).text() === catagory) {
        $('#inputCatagorySelect').val($(option).val()).trigger('change');
      }
    });
  }

  function bringEventData() {
    $('#inputTitle').val($('#outputTitle').val());
    $('#inputStartDate').val($('#outputStartDate').val());
    $('#inputEndDate').removeAttr('disabled').val($('#outputEndDate').val());
    $('#inputStartTime').val($('#outputStartTime').val());
    $('#inputEndTime').removeAttr('disabled').val($('#outputEndTime').val());
    changeCatagory($('#outputCatagory').val());
    $('#inputLocation').val($('#outputLocation').val());
    $('#inputDescription').val($('#outputDescription').val());
  }

  function editForm(id) {
    bringEventData();
    eventDataModalObj.hide();
    $('#eventModalTitle').text('Edit Event');
    $('#save-event-data').text('Save Changes');
    $('#save-event-data').removeAttr('eventID');
    $('#save-event-data').attr('eventID', id);
    eventModalObj.show();
    $('#save-event-data').click(function (e) {
      e.stopImmediatePropagation();
      if ($(this).text() === 'Save Changes') {
        const $id = $('#save-event-data').attr('eventID');
        editEvent($id, this);
        $('#save-event-data').removeAttr('eventID');
        eventModalObj.hide();
        $('#eventModalTitle').text('Add New Todo');
        $('#save-event-data').text('Save');
      }
    });
  }

  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto', // makes it responsive
    showNonCurrentDates: false,
    fixedWeekCount: false,
    dateClick: function (info) {
      const clickedDate = new Date(info.date);
      clickedDate.setHours(0, 0, 0, 0);

      const today = new Date(this.getDate());
      today.setHours(0, 0, 0, 0);

      if (clickedDate < today) return;

      const date = formatChangeforDate(info.date);
      $('#inputStartDate').val(date);
      $('#inputEndDate').removeAttr('disabled');
      $('#inputEndDate').val(date);
      eventModalObj.show();
    },
    dayCellClassNames: function (arg) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cellDate = new Date(arg.date);
      cellDate.setHours(0, 0, 0, 0);

      return (cellDate < today) ? ['fc-past-disabled'] : [];
    },
    events: loadEventsFromStorage(),
    editable: true,
    eventClick: function (info) {
      const event = info.event;
      viewEvent(JSON.parse(JSON.stringify(event)));

      $('#eventDataModal').find('.edit-event').removeAttr('id');
      $('#eventDataModal').find('.delete-event').removeAttr('id');

      $('#eventDataModal').find('.edit-event').attr('id', `e-${event.id}`);
      $('#eventDataModal').find('.delete-event').attr('id', `d-${event.id}`);

      eventDataModalObj.show();

      $(`#d-${event.id}`).click((e) => {
        e.stopPropagation();
        deleteEvent(event.id);
      });

      $(`#e-${event.id}`).click(function (e) {
        e.stopImmediatePropagation();
        const id = $(this).attr('id').split('-').at(1);
        editForm(id);
      });
    },
    eventClassNames: function (arg) {
      const viewType = arg.view.type;
      switch (viewType) {
        case 'dayGridMonth':
          return [];
        case 'dayGridWeek':
          return ['fs-6'];
        case 'dayGrid':
          return ['fs-4'];
        default: return [];
      }
    }
  });
  calendar.render();


  const splide = new Splide('#main-slider', {
    type: 'loop',
    perPage: 1,
    drag: false,
    autoHeight: true,
    arrows: false,
    pagination: false,
    autoplay: false,
  }).mount();

  const labels = ['Calendar View', 'List View'];
  const paginationContainer = document.querySelector('.custom-pagination');
  const buttonClass = ['border-0', 'px-3', 'py-2', 'fs-6', 'rounded-2', 'btn-secondary-subtle', 'slideButton']
  const activeButton = ['primary-button', 'text-white'];

  labels.forEach((label, index) => {
    const button = document.createElement('button');
    button.classList.add(...buttonClass);
    if (index === 0) button.classList.add(...activeButton);
    button.textContent = label;
    button.addEventListener('click', (eve) => {
      document.querySelectorAll('.slideButton').forEach((slideButton) => slideButton.classList.remove(...activeButton));
      splide.go(index);
      eve.target.classList.add(...activeButton);
    });
    paginationContainer.appendChild(button);
  })

  calendar.updateSize();
  splide.refresh();

  window.addEventListener('resize', () => {
    calendar.updateSize();
    splide.refresh();
  });

  function ISOformat(date, point) {
    const dateArr = date.split('-');
    let [dd, mm, yyyy] = dateArr;
    if (point === 'end') {
      const day = parseInt(dd, 10) + 1;
      dd = day.toString().padStart(2, '0');
    }
    return `${yyyy}-${mm}-${dd}`;
  }

  function getRandomColor() {
    const colors = Object.values(bootstrapColors);
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function saveNewEventData() {
    const title = $('#inputTitle').val().trim();
    const startDate = checkEventDateFormat('Start');
    const endDate = checkEventDateFormat('End');
    const startTime = checkEventTimeFormat('Start');
    const endTime = checkEventTimeFormat('End');
    const catagory = validateCatagory();
    const location = $('#inputLocation').val().trim();
    const description = $('#inputDescription').val().trim();

    if (!title || !startDate || !endDate || !startTime || !endTime || !catagory || !location) {
      $('#alert-content').text('Please Fill up properly');
      alertModalObj.show();
      eventModalObj.hide();
      setTimeout(() => {
        alertModalObj.hide();
        $('#alert-content').text('');
      }, 5000);
      return;
    }


    const isValidDate = Array.from(validDateSpan(startDate, endDate));

    if (!isValidDate[0] ||
      !(validTimeSpan(startTime, endTime, startDate, endDate))
    ) {
      $('#alert-content').text('Invalid Date-Time Input');
      alertModalObj.show();
      eventModalObj.hide();
      setTimeout(() => {
        alertModalObj.hide();
        $('#alert-content').text('');
      }, 5000);
      return;
    }

    const event = {
      id: Date.now().toString(),
      title: title,
      start: ISOformat(startDate, 'start'),
      end: ISOformat(endDate, 'end'),
      backgroundColor: getRandomColor(),
      allDay: true,
      extendedProps: {
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        location: location,
        catagory: catagory,
        desc: description
      }
    }

    addEventToLocalStorage(JSON.parse(JSON.stringify(event)));

    calendar.addEvent(event);

    const selectedCatText = $('#CatagorieSelect').find('option:selected').text();
    checkSelectedCatagory(selectedCatText);

    eventModalObj.hide();
  }

  $('#save-event-data').click(function () {
    if ($(this).text() === 'Save') {
      saveNewEventData();
    }
  });

  $('#TimeSelect').on('change', function () {
    const optionText = $(this).find('option:selected').text();

    switch (optionText) {
      case 'This Month':
        calendar.changeView('dayGridMonth');
        break;
      case 'This Week':
        calendar.changeView('dayGridWeek');
        break;
      case 'Today':
        calendar.changeView('dayGrid');
        break;
      default:
        calendar.changeView('dayGridMonth');
        break;
    }

    setTimeout(() => {
      calendar.updateSize();
      splide.refresh();
    }, 0);
  })

  function filterEvents(eventName) {
    const eventArr = loadEventsFromStorage();
    eventArr.filter((event) => {
      if (event.extendedProps.catagory === eventName) {
        calendar.addEventSource([event]);
      }
    });
  }

  function checkSelectedCatagory(optionText) {
    const eventArr = loadEventsFromStorage();
    if (eventArr.length) {
      calendar.removeAllEvents();

      switch (optionText) {
        case 'All Catagories':
          calendar.addEventSource(eventArr);
          break;
        case 'Meeting':
          filterEvents('Meeting')
          break;
        case 'Personal':
          filterEvents('Personal')
          break;
        case 'Work':
          filterEvents('Work')
          break;
        case 'Holiday':
          filterEvents('Holiday')
          break;
      }
    }
  }

  $('#CatagorieSelect').on('change', function () {
    const optionText = $(this).find('option:selected').text();
    checkSelectedCatagory(optionText);
  })
});