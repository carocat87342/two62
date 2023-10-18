<script>
    import { Bar, Line, mixins } from 'vue-chartjs'
    export default {
        extends: Line,
        mixins: [mixins.reactiveProp],
        props: ['chartData', 'options'],
        data() {
            return {
            }
        },
        mounted () {
            console.log('data', this.chartData, this.options);
            this.renderChart(this.chartData, this.options)
        },
        methods: {
        }
    }
</script>
