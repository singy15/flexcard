
var app = Vue.createApp({
  components: {
    "card": Card
  },
  data() {
    return {
      cards: [
        { id: 1, x: 100, y: 50, w: 200, h: 150, color: {r: 255, g: 255, b: 255}, text: "foo" },
        { id: 2, x: 100, y: 250, w: 200, h: 150, color: {r: 255, g: 255, b: 255}, text: "bar" }
      ]
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
      setTimeout(() => {
        this.saveToLocalStorage();
      }, 500);
    },
    dblClick(event) {
      this.addCard(event.clientX, event.clientY);
    },
    addCard(x,y) {
      let id = Math.max(...app.cards.map(x => x.id)) + 1;
      this.cards.push({
        id: id,
        x: x - 200/2 + document.body.scrollLeft,
        y: y - 100/2 + document.body.scrollTop,
        w: 200,
        h: 100,
        color: {r: 255, g: 255, b: 255},
        text: "",
        z: id,
      });
    },
    dragScroll(event) {
      if(event.buttons === 2) {
        document.body.scrollLeft -= event.movementX;
        document.body.scrollTop -= event.movementY;
      }
    },
    movez(param) {
      let cards = this.$refs.card.map(x => { return { z: x.getData().z, data: x.getData(), target: x }; });
      cards.filter(x => x.target == param.target)[0].z += (9000 * param.direction);
      cards.sort((a,b) => {
        return (a.z < b.z)? (-1) : ((a.z > b.z)? 1 : 0);
      });
      cards.forEach((x,i) => {
        x.target.setZ(i);
      });
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
        w: width + 1000,
        h: height + 1000,
      };
    },
  },
  mounted() {
    if(localStorage.getItem("/cards")) {
      let cards = JSON.parse(localStorage.getItem("/cards"));
      this.cards = cards;
    }
  }
}).mount("#app");

window.dblClick = app.dblClick;

