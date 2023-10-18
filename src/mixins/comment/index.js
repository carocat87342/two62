import {mapActions} from "vuex";

export default {
    data(){
        return {
            commentComponents: [],
            // isOpenCommentListsPane: false,
        }
    },
    methods:{
        ...mapActions("comment", [
            "getCommentComponents",
            "addCommentComponent",
            "deleteCommentComponent",
            "updateCommentComponent",
            "getCommentsAction",
            "updateCommentAction",
            "addComment",
            "deleteCommentAction"
        ]),
        async saveComment({component, comment, index}) {
            console.log('saveComment', comment);
            if(!component.comments || !component.comments.length){
                const savedComponent = await this.addCommentComponent(component);
                this.commentComponents[index] = savedComponent;
                comment.commentComponent.id = savedComponent.id
            }

            const addedComment = await this.addComment(comment);
            if (!addedComment.favoriteUsers) addedComment.favoriteUsers = []
            if (!this.commentComponents[index].comments) {
              this.commentComponents[index].comments = []
            }
            this.commentComponents[index].comments.push(addedComment)
            this.commentComponents = this.commentComponents.slice(0)
        },
        async updateComment({comment, component}){
            console.log('comment.updateCommentAction', comment, component)
            let updatedComment = await this.updateCommentAction(comment);
            console.log('updateComment', updatedComment);
        },
        async updateCommentComponent(component) {
            this.editingCommentId = "";
            await this.updateCommentComponent(component);
        },
        async deleteComment({comment, index}) {
            console.log('deleteComment', this.commentComponents[index].comments);
            let res = await this.deleteCommentAction(comment)
            console.log('deleteComment.result', res);
            const commentIndex = this.commentComponents[index].comments.findIndex(item=>item.id === res.id)
            this.commentComponents[index].comments.splice(commentIndex, 1)
        },
    },
    computed: {
      commentError(){
        return this.$store.state.comment.error;
      }
    },
    async created(){
        console.log('comment.mixin.created');
        this.commentComponents = await this.getCommentComponents(this.$route.path);
    }
}
