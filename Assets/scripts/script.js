console.log('script is running....');

//bootstrap colors
const bootstrapColors = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  success: '#198754',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#0dcaf0',
  dark: '#212529'
};

//datepicker for start Date
$("#inputStartDate").datepicker({
  minDate: 0,
  showButtonPanel: true,
  dateFormat: "dd-mm-yy",
});

//datepicker for end date
$("#inputEndDate").datepicker({
  minDate: 0,
  showButtonPanel: true,
  dateFormat: "dd-mm-yy",
});

//Timepicker for start time
$('#inputStartTime').timepicker();

//timepicker for end time
$('#inputEndTime').timepicker();

//event Modal to add new events or edit old events
const eventModal = $('#eventModal')[0];
const eventModalObj = new bootstrap.Modal(eventModal);

//To ensure that closing the modal clears all fields in the modal
const eventModalObserver = new MutationObserver((mutations) => {
  $.each(mutations, function (index, mutation) {
    if (mutation.attributeName === 'class') {
      const oldClasses = mutation.oldValue.split(' ');
      const newClasses = eventModal.className.split(' ');
      const removed = oldClasses.filter(cls => !newClasses.includes(cls));
      if (removed.includes('show')) {
        setTimeout(() => {
          $('#eventModal .form-control').val("");

          //To disable the end fields as without start date there couldn't be any end date or time
          $('#inputEndTime').attr('disabled', '');
          $('#inputEndDate').attr('disabled', '');

          //To set the select field to default value 
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

//To check wheather leap year or not
function isLeapYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

//check if date format is valid
function checkEventDateFormat(point) {
  const value = $(`#input${point}Date`).val().trim();

  //ensuring dd-mm-yyyy format
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return null;

  const [dd, mm, yyyy] = value.split('-');
  const day = parseInt(dd, 10);
  const month = parseInt(mm, 10);
  const year = parseInt(yyyy, 10);

  //ensuring valid date and month
  if (day < 1 || day > 31 || month < 1 || month > 12) return null;

  //ensuring feb has no more than 29 days
  if (month === 2 && day > 29) return null;

  //ensuring leap year
  if (month === 2 && day === 29 && !isLeapYear(year)) return null;

  //ensuring that apr, june, sept, nov has no more than 30 days
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    if (day > 30) return null;
  }

  //if all condition are passed than returns the value
  return value;
}

//check if time format is valid
function checkEventTimeFormat(point) {
  const value = $(`#input${point}Time`).val().trim();

  //ensuring hh:mm format
  if (!/^\d{2}:\d{2}/.test(value)) return null;

  const [hh, mm] = value.split(':');
  const hours = parseInt(hh, 10);
  const mins = parseInt(mm, 10);

  //ensuring proper hours min cycle
  if (hours < 0 || mins < 0) return null;
  return value;
}

//To ensure filling up the start time, end time is enabled and filled automatically
$('#inputStartTime').change(function () {
  if (!$('#inputEndTime').val().length && ($(this).val().length === 5 || !$(this).val().length)) {
    $('#inputEndTime').removeAttr('disabled');
    $('#inputEndTime').val($(this).val());
  }
})

//To ensure filling up the start date, end date is enabled and filled automatically
$('#inputStartDate').change(function () {
  if (!$('#inputEndDate').val().length && ($(this).val().length === 10 || !$(this).val().length)) {
    $('#inputEndDate').removeAttr('disabled');
    $('#inputEndDate').val($(this).val());
  }
})

//To validate catagory
function validateCatagory() {
  const value = $('#inputCatagorySelect').find('option:selected').text();
  const defaultOptionText = $('#eventModal select').children().first().text();

  //if 'select a catagory' is selected show error
  if (value === defaultOptionText) return null;
  return value;
}

//To check if date span between start and end date is valid or not
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

//To check if time span between start and end time is valid or not
function validTimeSpan(startTime, endTime, startDate, endDate) {
  const isValidDate = Array.from(validDateSpan(startDate, endDate));
  if (isValidDate[1] === 'greater') return true;

  const startHours = parseInt(startTime.split(':')[0], 10);
  const endHours = parseInt(endTime.split(':')[0], 10);

  if (startHours > endHours) return false;
  else if (startHours <= endHours) return true;
}

//alert modal for showing alerts
const alertModalObj = new bootstrap.Modal('#alertModal');

//modal for viewing saved event data
const eventDataModal = $('#eventDataModal')[0];
const eventDataModalObj = new bootstrap.Modal(eventDataModal);

//To ensure that closing the modal clears all fields in the modal
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

//To ensure date is saved in dd-mm-yyyy format
function formatChangeforDate(date) {
  const localDateStr = new Date(date).toLocaleDateString('en-US')
  const dateArr = localDateStr.split('/');
  const [month, day, year] = dateArr;
  return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year.padStart(4, '0')}`;
}

//To load event data from storage
function loadEventsFromStorage() {
  return JSON.parse(localStorage.getItem('event-data') ?? '[]');
}

//To add event data to storage
function addEventToLocalStorage(event) {
  const arr = loadEventsFromStorage();
  arr.push(event);
  localStorage.setItem('event-data', JSON.stringify(arr));
}

//To view saved events in eventdata modal
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

//To remove event data from storage
function RemoveEventFromStorage(id) {
  const eventArr = loadEventsFromStorage();
  const updatedEventArr = eventArr.filter((event) => event.id !== id)
  localStorage.setItem('event-data', JSON.stringify(updatedEventArr));
}

//to delte event from calendar and storage
function deleteEvent(id) {
  const event = calendar.getEventById(id);
  //deleting event from storage
  RemoveEventFromStorage(id);

  //deleting from calendar
  if (event) event.remove();

  //resizing the window by keeping the table clear if calendar view is on screen
  if (!$('#list-view').hasClass('primary-button')) {
    table.clear().draw();
  }
  eventDataModalObj.hide();
}

//To edit event in storage
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

//To get new data provided by the client
function getNewData(button) {
  const arr = [];
  const allInputs = Array.from($(button).parent().prev().find('input.seconadry-nav-select'));
  $.each(allInputs, function (index, input) {
    arr.push($(input).val().trim());
  });
  const descAreaText = $(button).parent().prev().find('textArea.seconadry-nav-select').val().trim();
  arr.push(descAreaText);
  const selectValue = $(button).parent().prev().find('select.form-select').find('option:selected').text();
  arr.push(selectValue);
  return [...arr];
}

//To edit event in storage and calendat
function editEvent(id, button) {
  const event = calendar.getEventById(id);

  //getting new data
  const newData = getNewData(button);

  //editing in storage
  editEventDataInStorage(JSON.parse(JSON.stringify(newData)), id);

  //to edit in calendar
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

  //To check what catagory sorting user wants
  const selectedCatText = $('#CatagorieSelect').find('option:selected').text();
  checkSelectedCatagory(selectedCatText);

  //remove events if expired
  removeExpiredEvent();

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

//To bring event data to edit form
function bringEventData() {
  $('#inputTitle').val($('#outputTitle').val().trim());
  $('#inputStartDate').val($('#outputStartDate').val().trim());
  $('#inputEndDate').removeAttr('disabled').val($('#outputEndDate').val().trim());
  $('#inputStartTime').val($('#outputStartTime').val().trim());
  $('#inputEndTime').removeAttr('disabled').val($('#outputEndTime').val().trim());
  changeCatagory($('#outputCatagory').val().trim());
  $('#inputLocation').val($('#outputLocation').val().trim());
  $('#inputDescription').val($('#outputDescription').val().trim());
}

//To edit data in table
function editTable(event, rowIndex) {
  const newEvent = new eventClass(event);
  const row = table.row(rowIndex);
  row.data(newEvent).draw(false);
}

//To get new data from storage to show on table
function assembleDataForTable(eventID, rowIndex) {
  let event = null;
  const storedEventArr = loadEventsFromStorage();
  $.each(storedEventArr, function (index, eachEvent) {
    //checking which row to edit by using eventid that was gotten from view button id
    if (eachEvent.id === eventID) {
      event = JSON.parse(JSON.stringify(eachEvent));
    }
  });
  //edit only a specific row
  editTable(event, rowIndex);
}

//To edit form
function editForm(id, rowIndex) {
  //editing data in form
  bringEventData();
  eventDataModalObj.hide();

  //changing status before showing the form
  $('#eventModalTitle').text('Edit Event');
  $('#save-event-data').text('Save Changes');
  $('#save-event-data').removeAttr('eventID');
  $('#save-event-data').removeAttr('rowIndex');
  $('#save-event-data').attr('eventID', id);
  $('#save-event-data').attr('rowIndex', rowIndex);

  eventModalObj.show();

  //save changes event
  $('#save-event-data').click(function (e) {
    e.stopImmediatePropagation();

    //if editing the form
    if ($(this).text() === 'Save Changes') {
      const $id = $('#save-event-data').attr('eventID');
      const $rowIndex = Number($(this).attr('rowIndex'));

      //editing the event 
      editEvent($id, this);

      //assemble new data for table
      if (!isNaN($rowIndex)) assembleDataForTable($id, $rowIndex);
      $('#save-event-data').removeAttr('eventID');
      $('#save-event-data').removeAttr('rowIndex');

      //To ensure table is clear when not shown
      if (!$('#list-view').hasClass('primary-button')) {
        table.clear().draw();
      }

      eventModalObj.hide();
      //changing names
      $('#eventModalTitle').text('Add New Todo');
      $('#save-event-data').text('Save');
    }
  });
}

//To carry on edit and delete related tasks
function eventTask(event, rowIndex) {
  //removing old id and targeted table rowindex from edit and delete button
  $('#eventDataModal').find('.edit-event').removeAttr('id');
  $('#eventDataModal').find('.delete-event').removeAttr('id');
  $('#eventDataModal').find('.delete-event').removeAttr('rowIndex');
  $('#eventDataModal').find('.edit-event').removeAttr('rowIndex');

  //adding new id to those buttons
  $('#eventDataModal').find('.edit-event').attr('id', `e-${event.id}`);
  $('#eventDataModal').find('.delete-event').attr('id', `d-${event.id}`);

  //adds rowindex only if called by datatable view button
  if (typeof rowIndex === 'number') {
    $('#eventDataModal').find('.delete-event').attr('rowIndex', rowIndex);
    $('#eventDataModal').find('.edit-event').attr('rowIndex', rowIndex);
  }

  eventDataModalObj.show();

  //delete button event
  $(`#d-${event.id}`).click((e) => {
    //parsing as number
    const rowIndex = Number($(e.target).attr('rowIndex'));
    const id = $(e.target).attr('id').split('-').at(1);

    //deleting event from calendar and storage
    deleteEvent(id);

    //deleting from table if table is shown
    if (!isNaN(rowIndex)) table.row(rowIndex).remove().draw();
    e.stopImmediatePropagation();
  });

  //edit button event
  $(`#e-${event.id}`).click(function (e) {
    e.stopImmediatePropagation();
    const id = $(this).attr('id').split('-').at(1);
    const rowIndex = $(this).attr('rowIndex');

    //to bring data to edit from
    editForm(id, rowIndex);
  });
}

//calendar is targeted
const calendarEl = document.querySelector('#calendar');

//calendar is initiated
const calendar = new FullCalendar.Calendar(calendarEl, {
  initialView: 'dayGridMonth', //initialview is only 'current month'
  height: 'auto', //auto height adjustment on window resize
  showNonCurrentDates: false, // disabling dates other than the current month
  fixedWeekCount: false, //removing extra unfilled rows from calendar
  dateClick: function (info) {
    //Clicking on any date calls this function
    const clickedDate = new Date(info.date);
    clickedDate.setHours(0, 0, 0, 0);

    const today = new Date(this.getDate());
    today.setHours(0, 0, 0, 0);

    //To ensure that no event can be added to past dates
    if (clickedDate < today) return;

    //changing the format of date
    const date = formatChangeforDate(info.date);
    //adding start date to modal
    $('#inputStartDate').val(date);

    //removing the disabled status from end dates
    $('#inputEndDate').removeAttr('disabled');
    $('#inputEndDate').val(date);
    eventModalObj.show();
  },
  dayCellClassNames: function (arg) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cellDate = new Date(arg.date);
    cellDate.setHours(0, 0, 0, 0);

    //disabling past dates
    return (cellDate < today) ? ['fc-past-disabled'] : [];
  },
  events: loadEventsFromStorage(), //load events from localstorage on reload
  editable: true,
  eventClick: function (info) {
    const event = info.event;
    //viewing the saved events
    viewEvent(JSON.parse(JSON.stringify(event)));

    //adding functionality to eventdata modal
    eventTask(JSON.parse(JSON.stringify(event)), "");
  },
  eventClassNames: function (arg) {
    //to decide font size for each view
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

//Initalizing splide slider
const splide = new Splide('#main-slider', {
  type: 'slide',
  perPage: 1,
  rewind: false,
  drag: false,
  autoHeight: true,
  arrows: false,
  pagination: false,
  autoplay: false,
}).mount();

//variables for spildeing custom pagination
const labels = ['Calendar View', 'List View'];
const paginationContainer = document.querySelector('.custom-pagination');
const buttonClass = ['border-0', 'px-3', 'py-2', 'fs-6', 'rounded-2', 'btn-secondary-subtle', 'slideButton']
const activeButton = ['primary-button', 'text-white'];

//To create and customize custom pagination buttons dynamically
labels.forEach((label, index) => {
  const button = document.createElement('button');
  button.classList.add(...buttonClass);
  if (index === 0) {
    button.classList.add(...activeButton);
    button.setAttribute('id', 'calendar-view');
  };
  if (index === 1) {
    button.setAttribute('id', 'list-view');
  }
  button.textContent = label;
  button.addEventListener('click', (eve) => {
    document.querySelectorAll('.slideButton').forEach((slideButton) => slideButton.classList.remove(...activeButton));

    //to change slide on cliking a button
    splide.go(index);
    eve.target.classList.add(...activeButton);

    //rendering or destroying calendar to save memory
    if (eve.target.innerText === 'Calendar View') {
      calendar.render();
    } else if (eve.target.innerText === 'List View') {
      calendar.destroy();
    }
  });
  paginationContainer.appendChild(button);

})

//updating size and refreshing slides on refreshing the page
calendar.updateSize();
splide.refresh();

//To ensure start date is saved in yyyy-mm-hh format
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

//To ensure new event data is saved
function saveNewEventData() {
  //getting data
  const title = $('#inputTitle').val().trim();
  const startDate = checkEventDateFormat('Start');
  const endDate = checkEventDateFormat('End');
  const startTime = checkEventTimeFormat('Start');
  const endTime = checkEventTimeFormat('End');
  const catagory = validateCatagory();
  const location = $('#inputLocation').val().trim();
  const description = $('#inputDescription').val().trim();

  //ensuing all the required fields are clicked
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

  //checking valid date span
  const isValidDate = Array.from(validDateSpan(startDate, endDate));

  //if not valid (returns false) or timespan is wrong show invalid date-time alert
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

  //create event object
  const event = {
    id: Date.now().toString(), //passing unique id
    title: title,
    start: ISOformat(startDate, 'start'), //passing in yyyy-mm-hh format
    end: ISOformat(endDate, 'end'),
    backgroundColor: getRandomColor(),
    allDay: true,
    extendedProps: { //extended property
      startDate: startDate,
      endDate: endDate,
      startTime: startTime,
      endTime: endTime,
      location: location,
      catagory: catagory,
      desc: description
    }
  }

  //adding to local storage
  addEventToLocalStorage(JSON.parse(JSON.stringify(event)));

  //adding to calendar
  calendar.addEvent(event);

  //dataTable is initialized
  dataTable();

  //checking user selected catagory for sorting
  const selectedCatText = $('#CatagorieSelect').find('option:selected').text();
  checkSelectedCatagory(selectedCatText);

  //removing events if expried
  removeExpiredEvent();

  //clearing table if it is not on screen
  if (!$('#list-view').hasClass('primary-button')) {
    table.clear().draw();
  }

  eventModalObj.hide();
}

//saving new event data
$('#save-event-data').click(function () {
  //works only to add new event
  if ($(this).text() === 'Save') {
    saveNewEventData();
  }
});

//Time wise selection in calendar only
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

//To check which events to show in calendar
function filterEvents(eventName) {
  const eventArr = loadEventsFromStorage();
  eventArr.filter((event) => {
    if (event.extendedProps.catagory === eventName) {
      calendar.addEventSource([event]);
    }
  });
}

//To check what catagory sorting is selected by client
function checkSelectedCatagory(optionText) {
  const eventArr = loadEventsFromStorage();

  //searching in table
  if ($('#list-view').hasClass('primary-button')) {
    if (optionText === 'All Catagories') table.search('').draw();
    else table.search(optionText).draw();
  }

  //searching in calendar
  if (eventArr.length) {
    //removing all events temporarilty
    calendar.removeAllEvents();

    switch (optionText) {
      case 'All Catagories':
        //show all events
        calendar.addEventSource(eventArr);
        break;
      case 'Meeting':
        //showing only sorted events
        filterEvents('Meeting');
        break;
      case 'Personal':
        filterEvents('Personal');
        break;
      case 'Work':
        filterEvents('Work');
        break;
      case 'Holiday':
        filterEvents('Holiday');
        break;
    }
  }
}

//catagory wise sorting
$('#CatagorieSelect').on('change', function () {
  const optionText = $(this).find('option:selected').text();
  checkSelectedCatagory(optionText);
})

//To remove Expired events from table
function removeExpiredEventsFromTable() {
  table.clear().draw();
  const dataSet = [];
  const storedEventArr = loadEventsFromStorage();
  $.each(storedEventArr, function (index, eachEvent) {
    const newEvent = new eventClass(eachEvent);
    dataSet.push(newEvent);
  });
  table.rows.add(dataSet).draw(false);
}

//removing expired event from storage and calendar
function removingWork(event) {
  const eventID = event.id;
  const storedEventArr = loadEventsFromStorage();
  const filteredEvents = storedEventArr.filter((event) => event.id !== eventID);
  localStorage.setItem('event-data', JSON.stringify(filteredEvents));
  calendar.getEventById(eventID).remove();

  //Removing expired events from table if table is present on screen
  if ($('#list-view').hasClass('primary-button')) {
    removeExpiredEventsFromTable();
  }
}

//removing event from calendar if expired
async function removeExpiredEvent() {
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US');
  const currentTime = now.toTimeString().slice(0, 5); //hh:mm

  const storedEventArr = loadEventsFromStorage()

  storedEventArr.forEach((event) => {
    const eventEndDate = new Date(ISOformat(event.extendedProps.endDate).split('-').join('/')).toLocaleDateString('en-US');

    const eventEndTime = event.extendedProps.endTime; //hh:mm

    //if last date is passed then remove expired events
    if (eventEndDate < currentDate) {
      removingWork(event);
      return;
    };

    //if current data is the last waits for endTime to pass
    if ((eventEndDate === currentDate) && (eventEndTime <= currentTime)) removingWork(event);
  })

}

//To ensure safe interval
async function safeInterval() {
  //checking if events are expired or not every second
  await removeExpiredEvent();
  setTimeout(() => {
    safeInterval();
  }, 1000);
}

//ensuring stack overflow doesn't happen
safeInterval();

//enabling date filtering/sorting in ascending or descending order
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "date-dd-mm-yyyy-pre": function (a) {
    if (!a) return 0;
    const dateParts = a.split('-');
    // Convert to YYYYMMDD for proper sorting
    return parseInt(dateParts[2] + dateParts[1] + dateParts[0], 10);
  },
  "date-dd-mm-yyyy-asc": function (a, b) {
    return a - b; //ascendeding order
  },
  "date-dd-mm-yyyy-desc": function (a, b) {
    return b - a; //descendeding order
  }
});

//enabling time filtering/sorting in ascending or descending order
jQuery.extend(jQuery.fn.dataTableExt.oSort, {
  "time-hh-mm-pre": function (a) {
    if (!a) return 0;
    const timeParts = a.split(':');
    // Convert to total minutes for proper sorting
    return parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
  },
  "time-hh-mm-asc": function (a, b) {
    return a - b; //ascending order
  },
  "time-hh-mm-desc": function (a, b) {
    return b - a; //desccending order
  }
});

//To enable searching from first charcter of each cell of each row in table (case insensetive searching)
$.fn.dataTable.ext.search = [];

$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
  const search = $('#searchEvent').val().trim();
  const searchLower = search.toLowerCase();

  // IMPORTANT: Don't skip '0'
  if (search === null) return true;

  return data.some(cell => cell.toLowerCase().startsWith(searchLower));
});

//To enable searching while typing
$('#searchEvent').on('input', function () {
  const calendarEventArr = [];
  const value = $(this).val().trim();

  //temporarilty removing all events from calendar
  calendar.removeAllEvents();

  const storedEventArr = loadEventsFromStorage();

  //if search bar is empty all events are shown in calendar and table
  if (!value) {
    calendar.addEventSource(storedEventArr);
    table.search('').draw();
    return;
  }

  //searaching in calendar using regex
  const searchingvalue = `^${value}`;
  const regExp = new RegExp(searchingvalue, 'i');
  $.each(storedEventArr, function (index, eachEvent) {
    //formating data event object
    const newEvent = new eventClass(eachEvent);
    newEvent.desc = eachEvent.extendedProps.desc;
    newEvent.catagory = eachEvent.extendedProps.catagory;

    $.each(newEvent, function (keys, data) {
      //if one of the data passes the regex test means search data is matched with event data push it
      if (regExp.test(data)) {
        calendarEventArr.push(eachEvent);
      }
    });
  });

  if (calendarEventArr.length) {
    //removing duplicate date from array
    const removeDuplicates1 = Array.from(new Map(
      calendarEventArr.map((obj) => [JSON.stringify(obj), obj])
    ).values()
    );
    //adding duplicate removed data to calendar
    calendar.addEventSource(removeDuplicates1);
  }

  //table is drawn based on search data
  table.draw();
})

//datatables section
function catgoryBadgeDeterminer(catagory) {
  const classNames = Object.keys(bootstrapColors);
  switch (catagory) {
    case 'Meeting':
      return classNames[classNames.length - 1];
    case 'Personal':
      return classNames[4];
    case 'Work':
      return classNames[3];
    case 'Holiday':
      return classNames[2];
  }
}

//eventclass for table
class eventClass {
  constructor(event) {
    this.title = event.title;
    this.startDate = event.extendedProps.startDate;
    this.endDate = event.extendedProps.endDate;
    this.startTime = event.extendedProps.startTime;
    this.endTime = event.extendedProps.endTime;
    this.catagory = `<div class="badge p-2 text-bg-${catgoryBadgeDeterminer(event.extendedProps.catagory)}">${event.extendedProps.catagory}</div>`;
    this.location = event.extendedProps.location;
    this.viewButton = `<button class="btn btn-primary view-event-table" id="v-${event.id}" onclick="viewButtonFunction(this)">view</button>`;
  }
}

//To initialize table based on window size
function initialTable() {
  //on screen width below 1200px a horizontal scrollbar is shown using scrollX property below
  const isMobile = $(window).width() < 1200;

  return $('#eventTable').DataTable({
    scrollX: isMobile,
    responsive: true,
    pageLength: 5,
    lengthChange: false,
    order: [],
    columns: [
      { data: 'title', title: 'Title' },
      { data: 'startDate', title: 'Start Date' },
      { data: 'endDate', title: 'End Date' },
      { data: 'startTime', title: 'Start Time' },
      { data: 'endTime', title: 'End Time' },
      { data: 'catagory', title: 'Catagory' },
      { data: 'location', title: 'Location' },
      { data: 'viewButton', title: 'View' },
    ],
    columnDefs: [
      {
        targets: [1, 2], //enabling date sorting inn column 2 and 3 [0 based indexing]
        type: 'date-dd-mm-yyyy'
      },
      {
        targets: [3, 4], //enabling time sorting inn column 4 and 5 [0 based indexing]
        type: 'time-hh-mm'
      }
    ],
    language: {
      paginate: {
        first: "First",
        last: "Last",
        next: "Next",
        previous: "Prev"
      }
    }
  })
}

//table config
let table = initialTable();

//on window resizing 
$(window).on('resize', () => {
  //calendar and slider size is determined
  calendar.updateSize();
  splide.refresh();

  //old table is destroyed and reinitialized to ensure responsive table nature
  table.destroy();
  table = initialTable();
});

//To add data to table
function addEventDataTable(dataSet) {
  //clearing old data so duplicates cannot be created
  table.clear().draw();

  //adding new rows
  table.rows.add(dataSet).draw(false);
}

//To initialize dataTable
function dataTable() {
  const dataSet = [];
  const storedEvents = loadEventsFromStorage();

  //converting classes to suitable format for table
  storedEvents.forEach((event) => {
    const eventObj = new eventClass(event);
    dataSet.push(eventObj)
  })

  //adding to table
  addEventDataTable(dataSet);
}

//list view button event
$('#list-view').click(function () {
  //To initialize new dataTable
  dataTable();

  //checking catagory
  const optionText = $('#CatagorieSelect').find('option:selected').text();
  checkSelectedCatagory(optionText);

  //hiding time select dropdown
  $('#TimeSelect').hide();
});

//calendar view button event
$('#calendar-view').click(function () {
  //clearing table data as it's not on screen
  table.clear().draw();

  //showing time select dropdown
  $('#TimeSelect').show();
})

//dataTable view button functionality
function viewButtonFunction(button) {
  let theEvent = null;
  const eventID = $(button).attr('id').split('-')[1];
  const storedEventArr = loadEventsFromStorage();
  $.each(storedEventArr, function (index, eachEvent) {
    if (eachEvent.id === eventID) {
      theEvent = JSON.parse(JSON.stringify(eachEvent));
    }
  });
  const rowIndex = table.row($(button).closest('tr')).index();
  viewEvent(theEvent);
  eventTask(theEvent, rowIndex);
}

//delete all events functionality
function deleteAllEvents() {
  localStorage.removeItem('event-data');
  calendar.removeAllEvents();
  table.clear().draw();
}

//Turned off Browser's autocomplete feature on all the input fields
$('input, textarea').attr('autocomplete', 'off')