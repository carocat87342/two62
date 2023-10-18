<template>
  <div>
    <canvas id="concept-area" width="1000" height="400"> </canvas>
    <img :src="renderedImage" />
  </div>
</template>
<script>
export default {
  props: {
    eventConcept: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      conceptCanvas: null,
      colorPositions: [
        { x: 0, y: 142, w: 200, h: 180 },
        { x: 120, y: 40, w: 240, h: 180 },
        { x: 440, y: 38, w: 220, h: 270 },
        { x: 750, y: 70, w: 130, h: 220 },
      ],
      imagePositions: [
        { x: 30, y: 70, w: 180, h: 180 },
        { x: 168, y: 170, w: 270, h: 150 },
        { x: 340, y: 70, w: 260, h: 180 },
        { x: 580, y: 90, w: 190, h: 230 },
        { x: 720, y: 50, w: 230, h: 150 },
      ],
      completedImages: 0,
      renderedImage: null,
    };
  },
  mounted() {
    var c = document.getElementById("concept-area");
    var ctx = c.getContext("2d");
    this.conceptCanvas = ctx;
    this.drawConcept();
  },
  methods: {
    drawConcept() {
      this.conceptCanvas.clearRect(0, 0, 1000, 400);
      this.colorPositions.forEach((pos, index) => {
        if (this.eventConcept.colors[index]) {
          let colorString = this.eventConcept.colors[index].color || this.eventConcept.colors[index].value;
          if (!colorString) colorString = "#EDEDED";
          this.conceptCanvas.fillStyle = colorString;
          this.conceptCanvas.fillRect(pos.x, pos.y, pos.w, pos.h);
        }
      });
      this.completedImages = 0;
      this.imagePositions.forEach((pos, index) => {
        if (this.eventConcept.images[index]) {
          var img = new Image();
          img.style.objectFit = "cover";
          img.src = this.eventConcept.images[index].url.replace("https", "http");
          img.crossOrigin = "anonymous";
          // img.crossOrigin = "anonymous";
          img.onload = () => {
            // this.conceptCanvas.drawImage(img, pos.x, pos.y, pos.w, pos.h);
            this.drawImageProp(this.conceptCanvas, img, pos.x, pos.y, pos.w, pos.h);
            this.completedImages = this.completedImages + 1;
            if (this.completedImages === 5) {
              var dataURL = document.getElementById("concept-area").toDataURL();
              this.renderedImage = dataURL;
              this.$store.commit("campaign/setAttribute", { name: "SAVING_DATE", key: "coverImage", value: dataURL });
            }
          };
        }
      });
    },
    drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
      if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
      }

      // default offset is center
      offsetX = typeof offsetX === "number" ? offsetX : 0.5;
      offsetY = typeof offsetY === "number" ? offsetY : 0.5;

      // keep bounds [0.0, 1.0]
      if (offsetX < 0) offsetX = 0;
      if (offsetY < 0) offsetY = 0;
      if (offsetX > 1) offsetX = 1;
      if (offsetY > 1) offsetY = 1;

      var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, // new prop. width
        nh = ih * r, // new prop. height
        cx,
        cy,
        cw,
        ch,
        ar = 1;

      // decide which gap to fill
      if (nw < w) ar = w / nw;
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
      nw *= ar;
      nh *= ar;

      // calc source rectangle
      cw = iw / (nw / w);
      ch = ih / (nh / h);

      cx = (iw - cw) * offsetX;
      cy = (ih - ch) * offsetY;

      // make sure source rectangle is valid
      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      // fill image in dest. rectangle
      ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
    },
  },
};
</script>
<style lang="scss" scoped>
#concept-area {
}
</style>