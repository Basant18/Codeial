{
    let createComment = function(){
        let newCommentForm = $('#new-comment-form');
        newCommentForm.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data){
                    console.log(data);
                    let newComment = newCommentDom(data.data.comment);
                    console.log(newComment);
                    $('#post-comments-'+data.data.comment.post).prepend(newComment);
                    deleteComment($(' .delete-comment-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment Created!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function(err){
                    console.log(err.responseText);
                }
            })
        });
    }

    let newCommentDom = function(comment){
        return $(`<li id="comment-${comment._id}">
        <p>
                <small>
                    <a  class="delete-comment-button" href="comments/destroy/${comment._id}"> X </a>
                </small>
            ${comment.content}
            <br>
            <small>
                ${comment.user.name}
            </small>
        </p>
    </li>`);
    }

    let deleteComment = function(deleteLink){
        console.log(deleteLink);
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    console.log("Delete => ",data);
                    $(`#comment-${data.data.comment_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted!",
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                },
                error: function(err){
                    console.log("Error => ",err.responseText);
                }
            });
        });
    }

    createComment();
}