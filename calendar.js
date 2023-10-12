let nav = 0;
const calendar = document.getElementById("calendar");
const backDiv = document.getElementById("backDiv");
const monthHeader = document.getElementById("monthHeader");
const monthsStringArray = ['January',
                           'February',
                           'March',
                           'April',
                           'May',
                           'June',
                           'July',
                           'August',
                           'September',
                           'October',
                           'November',
                           'December'];


const weekday = ['Monday', 
                 'Tuesday', 
                 'Wednesday', 
                 'Thursday', 
                 'Friday', 
                 'Saturday', 
                 'Sunday'];

function selected(id){
    
    const lastClicked = document.getElementsByClassName("clicked")
    if(lastClicked.length != 0){
        lastClicked[0].classList.remove('clicked')
    }
    document.getElementById(id).classList.add('clicked')
    
}

function loadCalendar() {
    calendar.innerHTML =""
    const today = new Date();
    const day = today.getDay();
   
    const currentMonth = today.getMonth();
    const month = (currentMonth + nav + 12)%12;
    const year = today.getFullYear() + Math.floor((currentMonth + nav)/12);
    const monthString = monthsStringArray[month];
    const noDaysInMonth = new Date(year, month + 1, 0).getDate();
    const noDaysInPrevMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1);
    const monthHeader = document.getElementById('monthHeader');
    monthHeader.innerText = monthString + " " + year

    const dateString = firstDayOfMonth.toLocaleDateString('en-uk', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const firstDayofMonthString = dateString.split(', ')[0];
    const paddingDays = weekday.indexOf(dateString.split(', ')[0]);

    for(let i = 1; i <= 42; i++) {
        const dayString = `${i - paddingDays}/${month + 1}/${year}`;
        let checkElement = document.getElementById(dayString);
        if(checkElement == null) {
            var daySquare = document.createElement('div');
            daySquare.setAttribute("id", dayString);
            calendar.appendChild(daySquare);
        }
        else {
            var daySquare = document.getElementById(dayString);
            daySquare.classList.remove("padding");
            daySquare.classList.remove("day");
        }

        daySquare.classList.add('square');
        if (i <= paddingDays) {
            daySquare.classList.add('padding');
            daySquare.innerText = noDaysInPrevMonth + i - paddingDays;
        
        } 
        else if (i - paddingDays <= noDaysInMonth){
            daySquare.classList.add('day');
            daySquare.innerText = i - paddingDays;
            document.getElementById(dayString).addEventListener('click', () => selected(id=dayString)
            )
        }

        else {
            daySquare.classList.add('padding');
            daySquare.innerText = i - noDaysInMonth - paddingDays;
        }
        
        
    }

    // let checkBackButton = document.getElementById("back");
    // if (nav > 0 ){
        
    //     if (checkBackButton == null){
    //         const backButton = document.createElement('button');
    //         backButton.setAttribute("id", "back");
    //         backButton.classList.add("btn nav");
    //         backButton.innerText("Back");
    //         //             // <button type="button" id="back" class="btn nav">Back</button>  
    //         backDiv.appendChild(backButton);
    //     }

    // }

    // else{
    //     if (checkBackButton != null){
    //         checkBackButton.remove();
    //     }
    // }
    
}



function monthSelector() {

    document.getElementById('next').addEventListener('click', () => {
        nav++;
        loadCalendar();

      });
    
    document.getElementById('back').addEventListener('click', () => {
        nav--;
        loadCalendar();
 
      });

}

loadCalendar();
monthSelector();