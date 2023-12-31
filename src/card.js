
function mergeDeeply(target, source, opts) {
    const isObject = obj => obj && typeof obj === 'object' && !Array.isArray(obj);
    const isConcatArray = opts && opts.concatArray;
    let result = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        for (const [sourceKey, sourceValue] of Object.entries(source)) {
            const targetValue = target[sourceKey];
            if (isConcatArray && Array.isArray(sourceValue) && Array.isArray(targetValue)) {
                result[sourceKey] = targetValue.concat(...sourceValue);
            }
            else if (isObject(sourceValue) && target.hasOwnProperty(sourceKey)) {
                result[sourceKey] = mergeDeeply(targetValue, sourceValue, opts);
            }
            else {
                Object.assign(result, {[sourceKey]: sourceValue});
            }
        }
    }
    return result;
}

let defaultTheme = {
  style(card) {
    return {
      width: `auto`,
      height: `auto`,
      top: `${card.info.y}px`,
      left: `${card.info.x}px`,
      position: `absolute`,
      // boxShadow: `rgba(0,0,0,0.3) 0px 6px 12px 0px`,
      padding: `10px`,
      // margin: `10px`,
      // backgroundColor: `rgba(${card.color.r},${card.color.g},${card.color.b},1.0)`,
      cursor: `move`,
    };
  },
  styleTextarea(card) {
    return {
      width: `${card.info.w}px`,
      height: `${card.info.h}px`,
      outline: `none`,
      border: `none`,
      position: `relative`,
      padding: `10px`,
      boxShadow: `rgba(0,0,0,0.3) 0px 6px 12px 0px`,
      backgroundColor: `rgba(${card.info.color.r},${card.info.color.g},${card.info.color.b},1.0)`,
      borderRadius: `2px`,
      fontFamily: `system`,
    };
  },
  styleMenu(card) {
    return {
      position: `absolute`,
      left: `-20px`,
      top: `-20px`,
      width: `40px`,
      height: `40px`,
      borderRadius: `20px`,
      // backgroundColor: `#78cd96`,
      backgroundColor: `rgba(${card.info.color.r},${card.info.color.g},${card.info.color.b},1.0)`,
      zIndex: `9999`,
      cursor: `pointer`,
    };
  },
  styleMenuDelete(card) {
    return {
      position: `absolute`,
      right: `0px`,
      top: `0px`,
      width: `20px`,
      height: `20px`,
      // backgroundColor: `#78cd96`,
      zIndex: `9999`,
      cursor: `pointer`,
    };
  },
  styleMenuIcon(card,opt) {
    return Object.assign({
      backgroundColor: `rgba(${card.info.textColor.r},${card.info.textColor.g},${card.info.textColor.b},0.5)`,
    },opt);
  },
};

let darkTheme = {
  style(card) {
    return {
      width: `auto`,
      height: `auto`,
      top: `${card.info.y}px`,
      left: `${card.info.x}px`,
      position: `absolute`,
      // boxShadow: `rgba(0,0,0,0.3) 0px 6px 12px 0px`,
      padding: `10px`,
      // margin: `10px`,
      // backgroundColor: `rgba(${card.color.r},${card.color.g},${card.color.b},1.0)`,
      cursor: `move`,
      zIndex: `${card.info.z}`,
      fontSize: '10px',
    };
  },
  styleTextarea(card) {
    let s = {
      width: `${card.info.w}px`,
      height: `${card.info.h}px`,
      border: `none`,
      position: `relative`,
      padding: `10px`,
      boxShadow: `rgba(255,255,255,0.3) 0px 0px 12px 0px`,
      backgroundColor: `rgba(0,0,0,0.7)`,
      color: `rgba(230,230,230,1.0)`,
      // border: `double 4px rgba(230,230,230,1.0)`,
      borderRadius: `0px`,
      fontFamily: `system`,
      // fontWeight: `bold`,
      // textShadow: `0px 0px 10px #fff`,
      outline: `solid 1px rgba(230,230,230,1.0)`,
    };

    // if(this.focused) {
    //   s.outline = `double 4px rgba(230,230,230,1.0)`;
    // } else {
    //   s.outline = `solid 1px rgba(230,230,230,1.0)`;
    // }

    return s;
  },
  styleMenu(card) {
    return {
      position: `absolute`,
      left: `-20px`,
      top: `-20px`,
      width: `40px`,
      height: `40px`,
      borderRadius: `20px`,
      // backgroundColor: `#78cd96`,
      backgroundColor: `rgba(${card.info.color.r},${card.info.color.g},${card.info.color.b},1.0)`,
      zIndex: `9999`,
      cursor: `pointer`,
    };
  },
  styleMenuDelete(card) {
    return {
      position: `absolute`,
      right: `0px`,
      top: `0px`,
      width: `20px`,
      height: `20px`,
      // backgroundColor: `#78cd96`,
      zIndex: `9999`,
      cursor: `pointer`,
    };
  },
  styleMenuFwd(card) {
    return {
      position: `absolute`,
      right: `44px`,
      top: `0px`,
      width: `20px`,
      height: `20px`,
      // backgroundColor: `#78cd96`,
      zIndex: `9999`,
      cursor: `pointer`,
    };
  },
  styleMenuBwd(card) {
    return {
      position: `absolute`,
      right: `22px`,
      top: `0px`,
      width: `20px`,
      height: `20px`,
      // backgroundColor: `#78cd96`,
      zIndex: `9999`,
      cursor: `pointer`,
    };
  },
  styleMenuIcon(card,opt) {
    return Object.assign({
      backgroundColor: `rgba(${card.info.textColor.r},${card.info.textColor.g},${card.info.textColor.b},0.5)`,
    },opt);
  },
};

let Card = {
  props: {
    data: Object,
    debug: Boolean
  },
  data() {
    return {
      dragState: null,
      focused: false,
      menuTimeout: null,
      // styler: defaultTheme,
      styler: darkTheme,
    };
  },
  computed: {
    info: {
      get: function() {
        return this.data;
      },
      set: function(value) {
        this.$emit('update:data', value);
      }
    }
  },
  methods: {
    validation() {
      if(this.info.x <= 0) { this.info.x = 5; }
      if(this.info.y <= 0) { this.info.y = 5; }
    },
    setZ(z) {
      this.info.z = z;
    },
    echo(msg) {
      console.log(msg);
    },
    setData(data) {
      this.info = data;
    },
    dragstart(event) {
      let x = event.clientX;
      let y = event.clientY;
      this.dragState = { x: x, y: y };
      this.$refs.card.classList.remove("slidein");
      //this.$refs.card.classList.add("slideup");
    },
    dragend(event) {
      let x = event.clientX;
      let y = event.clientY;
      let dx = x - this.dragState.x;
      let dy = y - this.dragState.y;
      this.dragState = null;
      this.dragged(dx, dy);
    },
    dragged(dx,dy) {
      //this.$refs.card.classList.remove("slideup");
      this.$refs.card.classList.add("slidein");
      this.info.x += dx;
      this.info.y += dy;
      this.validation();
      this.changed();
    },
    resized(w,h) {
      this.info.w = w;
      this.info.h = h;
      this.changed();
    },
    changed() {
      this.$emit("updated", this.info);
    },
    showMenu() {
      // setTimeout(() => {
      //   this.$refs.menu.classList.remove("fadeOut");
      //   this.$refs.menu.classList.add("fadeIn");
      // },0);
      setTimeout(() => {
        this.$refs.menuDel.classList.remove("fadeOut");
        this.$refs.menuDel.classList.add("fadeIn");
        this.$refs.menuFwd.classList.remove("fadeOut");
        this.$refs.menuFwd.classList.add("fadeIn");
        this.$refs.menuBwd.classList.remove("fadeOut");
        this.$refs.menuBwd.classList.add("fadeIn");
      },100);
      if(this.menuTimeout) {
        clearTimeout(this.menuTimeout);
      }
    },
    mouseover(event) {
      this.focused = true;
      this.showMenu();
    },
    mouseout(event) {
      this.focused = false;
      this.menuTimeout = setTimeout(() => {
        // this.$refs.menu.classList.remove("fadeIn");
        // this.$refs.menu.classList.add("fadeOut");
        this.$refs.menuDel.classList.remove("fadeIn");
        this.$refs.menuDel.classList.add("fadeOut");
        this.$refs.menuFwd.classList.remove("fadeIn");
        this.$refs.menuFwd.classList.add("fadeOut");
        this.$refs.menuBwd.classList.remove("fadeIn");
        this.$refs.menuBwd.classList.add("fadeOut");
        this.menuTimeout = null;
      }, 500);
    },
    // changeAnimState() {
    //   if(this.focused) {
    //     this.$refs.menu.classList.remove("fadeOut");
    //     this.$refs.menu.classList.add("fadeIn");
    //   } else {
    //     this.$refs.menu.classList.remove("fadeIn");
    //     this.$refs.menu.classList.add("fadeOut");
    //   }
    // },
    clsMenu() {
      // if(this.focused) {
      //   return ['fadeIn'];
      // } else {
      //   return ['fadeOut'];
      // }
    },
    getData() {
      return JSON.parse(JSON.stringify(this.info));
    },
    del() {
      this.$emit("deleted", this.info);
    },
    style() {
      return {
        width: `auto`,
        height: `auto`,
        top: `${this.info.y}px`,
        left: `${this.info.x}px`,
        position: `absolute`,
        // boxShadow: `rgba(0,0,0,0.3) 0px 6px 12px 0px`,
        padding: `10px`,
        // margin: `10px`,
        // backgroundColor: `rgba(${this.color.r},${this.color.g},${this.color.b},1.0)`,
        cursor: `move`,
      };
    },
    styleTextarea() {
      return {
        width: `${this.info.w}px`,
        height: `${this.info.h}px`,
        outline: `none`,
        border: `none`,
        position: `relative`,
        padding: `10px`,
        boxShadow: `rgba(0,0,0,0.3) 0px 6px 12px 0px`,
        backgroundColor: `rgba(${this.info.color.r},${this.info.color.g},${this.info.color.b},1.0)`,
        borderRadius: `2px`,
        fontFamily: `system`,
      };
    },
    styleMenu() {
      return {
        position: `absolute`,
        left: `-20px`,
        top: `-20px`,
        width: `40px`,
        height: `40px`,
        borderRadius: `20px`,
        // backgroundColor: `#78cd96`,
        backgroundColor: `rgba(${this.info.color.r},${this.info.color.g},${this.info.color.b},1.0)`,
        zIndex: `9999`,
        cursor: `pointer`,
      };
    },
    styleMenuDelete() {
      return {
        position: `absolute`,
        right: `0px`,
        top: `0px`,
        width: `20px`,
        height: `20px`,
        // backgroundColor: `#78cd96`,
        zIndex: `9999`,
        cursor: `pointer`,
      };
    },
    fwd(direction) {
      this.$emit("movez",{ direction: direction, data: this.info, target: this });
    }
  },
  watch: {
    "info.text": function(val){
      this.changed();
    }
  },
  mounted() {
    let resizeTimeout = null;
    (new ResizeObserver((entries, observer) => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        let borderBoxSize = entries[0].borderBoxSize[0];
        let w = borderBoxSize.inlineSize;
        let h = borderBoxSize.blockSize;
        this.resized(w,h);
        resizeTimeout = null;
      }, 100);
    })).observe(this.$refs.textarea);
  },
  template: 
`
<div v-bind:style="styler.style(this)" class="card" draggable="true" @dragstart="dragstart($event)" @dragend="dragend($event)" ref="card">

<div v-if="debug" :style="{ 
      position: 'absolute', 
      top: '0' + 'px',
      left: '0' + 'px', 
      color: '#fff',
      zIndex: 9999,
      fontSize: '9px',
    }">{{ JSON.stringify(info) }}</div>

<div :style="styler.styleMenu(this)" v-show="!dragState" ref="menu" class="fadeInit" @mouseout="mouseout($event)" @mouseover="mouseover($event)">
  <div class="menu-btn">
    <span :style="styler.styleMenuIcon(this, { bottom: '2px'})">
    </span>
    <span :style="styler.styleMenuIcon(this)">
    </span>
    <span :style="styler.styleMenuIcon(this,{ top: '5px'})">
    </span>
  </div>
</div>
<div :style="styler.styleMenuDelete(this)" v-show="!dragState" ref="menuDel" class="fadeInit round_btn" 
    @mouseout="mouseout($event)" @mouseover="mouseover($event)"
    @click="del()">
</div>
<div :style="styler.styleMenuFwd(this)" v-show="!dragState" ref="menuFwd" class="fadeInit round_btn_up" 
    @mouseout="mouseout($event)" @mouseover="mouseover($event)"
    @click="fwd(1)">
</div>
<div :style="styler.styleMenuBwd(this)" v-show="!dragState" ref="menuBwd" class="fadeInit round_btn_down" 
    @mouseout="mouseout($event)" @mouseover="mouseover($event)"
    @click="fwd(-1)">
</div>
<textarea name="'card-' + (card.id).toString()" ref="textarea" v-model="info.text" spellcheck="false" @mouseout="mouseout($event)" @mouseover="mouseover($event)" 
    :style="styler.styleTextarea(this)" draggable="true" @dragstart.stop.prevent></textarea>
</div>
`
};

window.Card = Card;

