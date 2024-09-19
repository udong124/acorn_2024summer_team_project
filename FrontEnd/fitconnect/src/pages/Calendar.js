import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid' 
import './css/Calendar.css'


function Calendar() {

  return (
  
      <div className='container'>
        <h2>Calendar</h2>
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          height={'auto'}

          locale={'ko'}
          events={[
            { title: '회원', date: '2024-09-02' },
          ]} 
          />
      </div>
  );
}

export default Calendar;
