
var app = Vue.createApp({
  components: {
    "card": Card
  },
  data() {
    return {
      cards: [
        {
          "x": 100,
          "y": 100,
          "w": 200,
          "h": 100,
          "color": {
            "r": 255,
            "g": 255,
            "b": 255
          },
          "textColor": {
            "r": 0,
            "g": 0,
            "b": 0
          },
          "text": "test",
          "z": 1,
          "softwareVersion": 2,
          "id": 1
        }
      ],
      debug: true,
      saveTimeout: null
    };
  },
  watch: {
    cards: {
      handler() {
        this.saveToLocalStorage();
      },
      deep: true
    }
  },
  methods: {
    echo(val) {
      console.log(val);
    },
    saveToLocalStorage() {
      if(this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      
      this.saveTimeout = setTimeout(() => {
        console.log("save");
        let cards = this.cards;
        localStorage.setItem("/cards", JSON.stringify(cards));
        this.saveTimeout = null;
      }, 1000);
    },
    cardUpdated() {
      this.saveToLocalStorage();
    },
    cardDeleted(info) {
      this.cards = this.cards.filter(x => x.id !== info.id);
    },
    dblClick(event) {
      this.addCard(event.clientX, event.clientY);
    },
    addCard(x,y) {
      let id = Math.max(...this.cards.map(x => x.id)) + 1;
      this.cards.push({
        x: x - 200/2 + document.body.scrollLeft,
        y: y - 100/2 + document.body.scrollTop,
        w: 200,
        h: 100,
        color: {r: 255, g: 255, b: 255},
        textColor: {
          r: 0,
          g: 0,
          b: 0
        },
        text: "",
        z: id,
        id: id,
        softwareVersion: 2,
      });
    },
    dragScroll(event) {
      if(event.buttons === 2) {
        document.body.scrollLeft -= event.movementX;
        document.body.scrollTop -= event.movementY;
      }
    },
    movez(param) {
      let cards = this.cards.map(x => { return { z: x.z, data: x, target: x }; });
      cards.filter(x => x.target == param.target)[0].z += (9000 * param.direction);
      cards.sort((a,b) => {
        return (a.z < b.z)? (-1) : ((a.z > b.z)? 1 : 0);
      });
      cards.forEach((x,i) => {
        x.target.z = i;
      });
    },
    calcScreenSize() {
      var width = 0;
      var height = 0;

      if(this.cards.length > 0) {
        this.cards.forEach((c) => {
          let m = c;
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
    scrollToCard(card) {
      document.body.scrollLeft = card.x - (window.innerWidth / 2) + (card.w / 2);
      document.body.scrollTop = card.y - (window.innerHeight / 2) + (card.h / 2);
    }
  },
  computed: {
    sorted() {
      return this.cards.map(x => x).sort(x => x.id);
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

