<!DOCTYPE html>
<html>
    <head>
        <style>
            .notification { margin: 0.5em; }
            .yes { float: left; }
            .no { float: right; }
            .message { border: 1px solid gray; padding: .3em ;}
        </style>
    </head>
    <body>
        <div class="notification">
            <div class="message">
                <?php echo $data['content']; ?>
            </div>
            <form class="buttons" method="post" action="answerToQuestion">
                <input type="hidden" name="auth_user_id" value="" />
                <input type="hidden" name="question_id" value="<?php echo $data['question_id']; ?>" />
                <button name="status" value="yes" type="submit" class="yes">Yes</button>
                <button name="status" value="no" type="submit" class="no">No</button>
            </form>
        </div>
    </body>
</html>

