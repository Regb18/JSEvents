var events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

// Separation of Concerns

// Element IDs
// eventsDropdown
// dropdownItemTemplate
// eventTableBody
// eventTableRowTemplate


// Entry Point Function
function buildDropdown() {
    // get dropdown menu from the page
    let dropdownMenu = document.getElementById('eventsDropdown');
    // empty the innerHTML to ensure it is clean
    dropdownMenu.innerHTML = "";

    // get our evemts
    let currentEvents = getEventData();

    // pull out JUST the city names
    let eventCities = currentEvents.map( (event) => event.city );
    // filter the cities to only DISTINCT city names
    let distinctCities = [...new Set(eventCities)];

    // gets template from page
    const template = document.getElementById('dropdownItemTemplate');

    // copy the template - true gives full copy of the template, false only gives the first layer
    let dropdownTemplateNode = document.importNode(template.content, true);
    // get the <a> tag from template copy - querySelector will grab just the first thing it hits. can also grab stuff from the document - document.querySelector('') 
    let menuItem = dropdownTemplateNode.querySelector('a');
    // change the text
    menuItem.textContent = 'All Cities';
    menuItem.setAttribute('data-string', 'All')

    // Add item to the page
    dropdownMenu.appendChild(dropdownTemplateNode);



    for(let i = 0; i < distinctCities.length; i++) {
        let cityMenuItem  = document.importNode(template.content, true)
        let cityButton = cityMenuItem.querySelector('a');

        cityButton.textContent = distinctCities[i];
        cityButton.setAttribute("data-string", distinctCities[i]);

        dropdownMenu.appendChild(cityMenuItem);
    }

    displayStats(currentEvents);
    displayEventData(currentEvents);
}




function displayStats(eventsArray) {
    let stats = calculateAll(eventsArray);

    
    document.getElementById('total').textContent = stats.sum.toLocaleString();
    document.getElementById('average').textContent = stats.average.toLocaleString(
        "en-US", {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0
        }
    );
    document.getElementById('most').textContent = stats.maxEvent.toLocaleString();
    document.getElementById('least').textContent = stats.minEvent.toLocaleString();
}

// All calc in one loop
function calculateAll(eventsArray) {
    let dataSet = {
        sum: 0,
        average: 0,
        maxEvent: eventsArray[0].attendance,
        minEvent: eventsArray[0].attendance,

    };
    

    for(let i = 0; i < eventsArray.length; i++) {
        let currentEvent = eventsArray[i].attendance;
        dataSet.sum += currentEvent;

        if(currentEvent > dataSet.maxEvent) {
            dataSet.maxEvent = currentEvent;
        } else if (currentEvent < dataSet.minEvent) {
            dataSet.minEvent = currentEvent;
        }


    }
    dataSet.average = dataSet.sum / eventsArray.length;

    return dataSet;
}


// Add Median
function calculateMedian() {
    // order numbers




}

function displayEventData(eventsArray) {
    let tableBody = document.getElementById('eventTableBody');
    const eventTableRowTemplate = document.getElementById('eventTableRowTemplate');

    tableBody.innerHTML = "";

    for(let i = 0; i < eventsArray.length; i++) {
        let eventRow = document.importNode(eventTableRowTemplate.content, true);
        let currentEvent = eventsArray[i];


        // [ <td data-id="event"></td>
        // <td data-id="city"></td>
        // <td data-id="state"></td>
        // <td data-id="attendance"></td>
        // <td data-id="eventDate"></td> ]

        // this is an array of the <td>'s from the template - were going to change them 
        let tableCells = eventRow.querySelectorAll('td');

        tableCells[0].textContent = currentEvent.event;
        tableCells[1].textContent = currentEvent.city;
        tableCells[2].textContent = currentEvent.state;
        tableCells[3].textContent = currentEvent.attendance;
        tableCells[4].textContent = currentEvent.date;

        tableBody.appendChild(eventRow);
    }
}

function getEventData() {
  // parse "deserializes" our string and turns it into the array of objects it was so we can use it"
  let currentEvents = JSON.parse(localStorage.getItem('reg-eventWatchersData'));

  // null == nothing was found/ nothing exists / like a black hole
  // if nothing was in there - we start one -- set currentEvents to our events array of objects and use setItem
  if (currentEvents == null) {
    currentEvents = events;
    // JSON.stringify (serializes) turns our array into a string because local storage can only store strings
    localStorage.setItem('reg-eventWatchersData', JSON.stringify(currentEvents) );

  }

  return currentEvents;

}


function getEvents(element) {
  // gets all the events we have
  let currentEvents = getEventData();

  // use the element we clicked on to get the data-string attribute
  let cityName = element.getAttribute('data-string');

  let filteredEvents = currentEvents;
  
  if (cityName != 'All') {
    
      // filters the events to only the ones with the city name we clicked on
      filteredEvents = currentEvents.filter(
      
        // anonymous function, the parameter in the function can be named anything
      function(event) {
        if (cityName == event.city) {
          return event;
        }
      }
    );

  }
  document.getElementById('statsHeader').textContent = cityName;
  displayStats(filteredEvents);
  displayEventData(filteredEvents);
  
  
  // the arrow function version
  // filteredEvents = currentEvents.filter( event => cityName == event.city );
}

function saveEventData() {
  let eventName = document.getElementById('newEventName').value;
  let cityName = document.getElementById('newEventCity').value;
  let eventAttendance = parseInt(document.getElementById('newEventAttendance').value);
  let eventDate = document.getElementById('newEventDate').value;

  eventDate = `${eventDate} 00:00`;
  eventDate = new Date(eventDate).toLocaleDateString();

  let stateSelect = document.getElementById('newEventState');
  let state = stateSelect.options[stateSelect.selectedIndex].text;

  let newEvent = {
    event: eventName,
    city: cityName,
    state: state,
    attendance: eventAttendance,
    date: eventDate,
  }

  let currentEvents = getEventData();
  currentEvents.push(newEvent);

  // since we're setting a new item into local storage we have to stringify it
  localStorage.setItem("reg-eventWatchersData", JSON.stringify(currentEvents));

  // update the page
  buildDropdown();
  document.getElementById('statsHeader').textContent = 'All';
  document.getElementById('newEventForm').reset();
}