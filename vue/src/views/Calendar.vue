<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <!--when we click dialog become true -->
          <!--dialog is a kind of popup/formular and we will cearte 
            it after the sheet -->
          <v-btn color="primary" class="mr-3" dark @click="dialog = true">
            New Event
          </v-btn>
          <v-btn outlined class="mr-3" color="green darken-3" @click="setToday">
            Today
          </v-btn>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next" class="mr-3">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <!--the date that depende on the type  -->
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on }">
              <v-btn outlined color="grey darken-3" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>

      <!-- ADD EVENT DIALOG -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-container>
            <v-form @submit.prevent="addEvent">
              <v-text-field
                v-model="name"
                type="text"
                label="event name (required)"
              ></v-text-field>
              <v-text-field
                v-model="details"
                type="text"
                label="detail"
              ></v-text-field>
              <v-text-field
                v-model="start"
                type="date"
                label="start (required)"
              ></v-text-field>
              <v-text-field
                v-model="end"
                type="date"
                label="end (required)"
              ></v-text-field>
              <v-text-field
                v-model="color"
                type="color"
                label="select color (click to open color menu)"
              ></v-text-field>
              <v-btn
                type="submit"
                color="primary"
                class="mr-4"
                @click.stop="dialog = false"
                ><!--the dialog go a way (false) when we submit-->
                Create Event
              </v-btn>
            </v-form>
          </v-container>
        </v-card>
      </v-dialog>

      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary darken-1"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" :width="350" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-card-text>
              <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.details }}
              </form>
              <form v-else>
                <!--the texte area where we can modifi the detailS-->
                <textarea-autosize
                  v-model="selectedEvent.details"
                  type="text"
                  style="width: 100%"
                  :min-height="80"
                  placeholder="add note"
                >
                </textarea-autosize>
              </form>
            </v-card-text>
            <v-card-actions>
              <!--Here is the close buton to close the popup of the event-->
              <!--selectedOpen become false so it will close-->
              <v-btn text color="secondary" @click="selectedOpen = false">
                <v-icon small>mdi-minus</v-icon>
                Close
              </v-btn>
              <!--Here it's a buton with a condition that say -->
              <!--if you are note in editing mode show the buton (pencil)-->
              <!--to edit the details -->
              <v-btn
                v-if="currentlyEditing !== selectedEvent.id"
                text
                @click.prevent="editEvent(selectedEvent)"
                ><!--edit event is a funtion to edit the event so we give 
              to this fonction the selected event
              WE CAN BE IN EDIT MODE-->
                <v-icon small>mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn
                text
                v-else
                type="submit"
                @click.prevent="updateEvent(selectedEvent)"
              >
                <v-icon small> mdi-checkbox-marked-circle </v-icon>
                Save
              </v-btn>
              <!--updateEvent update the event selected in the firebase -->
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      focus: new Date().toISOString().substr(0, 10),
      type: "month",
      typeToLabel: {
        month: "Month",
        week: "Week",
        day: "Day",
        "4day": "4 Days",
      },
      name: null,
      details: null,
      start: null,
      end: null,
      color: "#097BD2", // DEFAULT EVENT COLOR
      currentlyEditing: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      dialog: false,
      dialogDate: false,
      events: [],
      toGetEvents: true,
    };
  },
  // computed properties enable you to create a property that can be used
  //to modify, manipulate, and display data within your components in a readable
  //and efficient manner.
  computed: {
    //here the to followed fonction help us to have a butifull date title

    //the title is a called fonction in the toolbar
    title() {
      const { start, end } = this;
      if (!start || !end) {
        return "";
      }
      const startMonth = this.monthFormatter(start);
      const endMonth = this.monthFormatter(end);
      const suffixMonth = startMonth === endMonth ? "" : endMonth;
      const startYear = start.year;
      const endYear = end.year;
      const suffixYear = startYear === endYear ? "" : endYear;
      const startDay = start.day + this.nth(start.day); // il appelle nth pour avoir le bon prefix
      const endDay = end.day + this.nth(end.day);

      //here the switch help us to have the good date for the good type
      switch (this.type) {
        case "month":
          return `${startMonth} ${startYear}`;
        case "week":
        case "4day":
          return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`;
        case "day":
          return `${startMonth} ${startDay} ${startYear}`;
      }
      return "";
    },
    monthFormatter() {
      return this.$refs.calendar.getFormatter({
        timeZone: "UTC",
        month: "long",
      });
    },
  },
  watch: {
    toGetEvents: "getEvents",
  },

  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = this.today;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    //ev is the event selected to be edit
    editEvent(ev) {
      this.currentlyEditing = ev.id;
    },
    //to show the event popup if it's open selectedOpen become true

    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => (this.selectedOpen = true), 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    updateRange({ start, end }) {
      this.start = start;
      this.end = end;
    },

    async getEvents() {
      console.log("getting events...");
      let options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      fetch("http://localhost:8080/api/events", options)
        .then((events) => events.json())
        .then((events) => (this.events = events))
        .catch((err) => console.error(err));

      this.toGetEvents = false;
      console.log(this.events);
    },

    async addEvent() {
      let options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color,
        }),
      };

      fetch("http://localhost:8080/api/events", options)
        .then((response) => response.json())
        .catch((error) => {
          console.error("Error:", error);
        });
      (this.name = null),
        (this.details = null),
        (this.start = null),
        (this.end = null),
        (this.color = "#097BD2"), // DEFAULT EVENT COLOR
        (this.toGetEvents = true);
      this.$forceUpdate();
    },

    async updateEvent(event) {
      let options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details: event.details,
        }),
      };

      fetch("http://localhost:8080/api/events/" + event.id, options)
        .then((response) => response.json())
        .catch((err) => console.error(err));

      this.selectedOpen = false;
      this.currentlyEditing = null;
      this.toGetEvents = true;
    },

    async deleteEvent(event) {
      let options = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };

      fetch("http://localhost:8080/api/events/" + event.id, options)
        .then((response) => response.json())
        .catch((err) => console.error(err));

      this.selectedOpen = false;
      this.currentlyEditing = null;
      this.toGetEvents = true;
    },

    //the nth fonc help us to have the good postfix for the date
    nth(d) {
      return d > 3 && d < 21
        ? "th" // if sup to 3 or inf to 21 it take th
        : ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][d % 10];
    },
  },
  mounted() {
    this.getEvents();
  },
};
</script>
