
var app = Vue.createApp({
  components: {
    "card": Card
  },
  data() {
    return {
      cards: [
        { id: 1, x: 100, y: 50, w: 200, h: 150, color: {r: 255, g: 255, b: 255}, text: "foo" },
        { id: 2, x: 100, y: 250, w: 200, h: 150, color: {r: 255, g: 255, b: 255}, text: "bar" }
      ],
      scrollX: 0,
      scrollY: 0,
      zoom: 1.0,
      debug: false
    };
  },
  methods: {
    echo(val) {
      console.log(val);
    },
    saveToLocalStorage() {
      let cards = this.$refs.card.map(x => x.getData());
      localStorage.setItem("/cards", JSON.stringify(cards));
    },
    cardUpdated() {
      this.saveToLocalStorage();
    },
    cardDeleted(info) {
      this.cards = this.cards.filter(x => x.id !== info.id);
      this.saveToLocalStorage();
    },
    dblClick(event) {
      this.addCard(event.clientX, event.clientY);
    },
    addCard(x,y) {
      let id = Math.max(...app.cards.map(x => x.id)) + 1;
      this.cards.push({
        id: id,
        x: x - 200/2,
        y: y - 100/2,
        w: 200,
        h: 100,
        color: {r: 255, g: 255, b: 255},
        text: ""
      });
    },
    dragScroll(event) {
      if(event.buttons === 2) {
        // document.body.scrollLeft -= event.movementX;
        // document.body.scrollTop -= event.movementY;
        this.scrollX -= event.movementX;
        this.scrollY -= event.movementY;
      }
    },
    // dragScrollStart(event) {
    //   this.dragScrolling = true;
    // },
    // dragScrollEnd(event) {
    //   this.dragScrolling = false;
    //   if(event.button === 2) {
    //     event.preventDefault();
    //   }
    // },
    calcScreenSize() {
      var width = 0;
      var height = 0;

      if(this.$refs.card) {
        this.$refs.card.forEach((c) => {
          let m = c.getData();
          if (width < m.x + m.w) {
            width = m.x + m.w;
          }
          if (height < m.y + m.h) {
            height = m.y + m.h;
          }
        });
      } else {
        width += 100;
        height += 100;
      }

      return {
        w: width + 40,
        h: height + 40,
      };
    },
    mousewheel(event) {
      this.zoom += event.deltaY * 0.001;
    }
  },
  mounted() {
    if(localStorage.getItem("/cards")) {
      let cards = JSON.parse(localStorage.getItem("/cards"));
      this.cards = cards;
    }
  }
}).mount("#app");

window.dblClick = app.dblClick;

