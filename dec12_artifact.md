
Ability to request coaching assistance 

- schedule appointments
  /coach available
    check if coach is connected to their gcal
      if no take them through the auth process & set available
      if yes, set available.
  /coach unavailable
  - if coach is available
    - coaches can connect their gcal
      - coaches can indicate multiple calenders
    - coaches can set themselves available
      - avilability command checks whether they're able to coach.
  -find next available appointment slot that is long enough
  /coach appointment  >>opens form in iframe
              Who's coming: @someone @someoneElse 
              Description: "I'm a really great description"
              Length of Appt: default 30 min
    - command doesn't work if another person's GH isn't indicated (flag on the chat?)
    - checks all available coaches schedules
    - automatically assigns mentee to appointmnt slot
    - makes event in Google calendar
    - notifies all parties (?)

get: list of active coaches when /coach is run, who are active coaches
/coach appointment = confirm
/coach available = confirm
/coach unavailable = confirm
