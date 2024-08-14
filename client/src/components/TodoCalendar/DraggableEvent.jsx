import { Draggable } from '@fullcalendar/interaction'
import { useEffect, useRef } from 'react'

export default function DraggableEvent({ id, title, duration, children }) {
  const ref = useRef(null)

  useEffect(() => {
    let draggable = new Draggable(ref.current, {
      eventData: {
        title,
        duration,
      },
    })
    return () => draggable.destroy()
  })

  return (
    <div className={'cursor-pointer hover:bg-gray-50 rounded-xl p-2'} id={id} ref={ref} data-event-title={title} data-event-duration={duration}>
      {children}
    </div>
  )
}
