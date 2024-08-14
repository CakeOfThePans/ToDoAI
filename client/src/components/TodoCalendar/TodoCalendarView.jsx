import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import { useState } from "react"

export default function TodoCalendarView() {
  const [events, setEvents] = useState([])

  const handleSelect = (info) => {
    const { start, end } = info;
    const eventNamePrompt = prompt("Enter, event name");
    if (eventNamePrompt) {
      setEvents([
        ...events,
        {
          start,
          end,
          title: eventNamePrompt,
        },
      ]);
    }
  }

  const handleDrop = (info) => {
    const newEvent = {
      title: info.draggedEl.getAttribute('data-event-title'),
      start: info.dateStr,
      duration: info.draggedEl.getAttribute('data-event-duration'),
    };

    setEvents([...events, newEvent])
  }

  return (
    <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex-grow m-4 rounded-xl p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        height='100%'
        editable
        selectable
        droppable
        events={events}
        select={handleSelect}
        drop={handleDrop}
      />
    </div>
  )
}
