export default {
    data(){
        return {
            windowWidth: window.innerWidth,
        }
    },
    created() {
        this.$nextTick(() => {
            window.addEventListener("resize", this.onResize);
        });
    },
    methods: {
        onResize() {
            this.windowWidth = window.innerWidth;
        },
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },
    computed: {
        isMobile() {
            return this.windowWidth < 960;
        },
    }
}
