import { Draggable, ThirdPartyDraggable } from '@fullcalendar/interaction'
import { useEffect, useRef } from 'react'

export default function DraggableEvent({ id, title, duration, backgroundColor, children }) {
  const ref = useRef(null)

  useEffect(() => {
  let draggable = new ThirdPartyDraggable(ref.current, {
    itemSelector: '.react-draggable',
    mirrorSelector: '.custom-mirror',
    eventData: function (eventEl) {
      return {
        id: id,
        title: title,
        duration: minutesToHHMM(duration),  //must put duration in HH:MM format
        backgroundColor: backgroundColor,
        borderColor: backgroundColor
      };
    },
  });

    return () => draggable.destroy()
  })

  function minutesToHHMM(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(mins).padStart(2, '0');
    
    return `${paddedHours}:${paddedMinutes}`;
}

  return (
    <div ref={ref} data-event-id={id} data-event-title={title} data-event-duration={duration}>
      {children}
    </div>
  )
}
