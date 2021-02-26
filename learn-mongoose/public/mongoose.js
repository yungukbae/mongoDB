

//사용자 이름 클릭시 댓글 로딩
document.querySelectorAll('#user-list tr').forEach(function (el) {
    el.addEventListener('click',function() {
        var id= el.querySelector('td').textContent;
        getComment(id);
    });
});


//사용자 로딩
function getUser() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 200){
            var users = JSON.parse(xhr.responseText);
            console.log(users);
            var tbody = document.querySelector('#user-list tbody');
            tbody.innerHTML = '';
            users.map(function(user){
                var row = document.createElement('tr');
                row.addEventListener('click', function() {
                    getComment(user._id);
                });
                var td = document.createElement('td');
                td.textContent = user._id;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.name;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.age;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = user.married ? 'married' : 'solo';
                row.appendChild(td);
                tbody.appendChild(row);
            });
        }else{
            console.error(xhr.responseText);
        }
    };
    xhr.open('GET','/users');
    xhr.send();
}

//댓글 로딩

function getComment(id){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status == 200){
            var comments = JSON.parse(xhr.responseText);
            var tbody = document.querySelector('#comment-list tbody');
            tbody.innerHTML = '';
            comments.map(function(comment){
                var row = document.createElement('tr');
                var td = document.createElement('td');
                td.textContent = comment._id;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = comment.commenter.name;
                row.appendChild(td);
                td = document.createElement('td');
                td.textContent = comment.comment;
                row.appendChild(td);
                var edit = document.createElement('button');
                edit.textContent = 'alert';
                edit.addEventListener('click', function(){
                    var newComment = prompt('insert alert comment');
                    if(!newComment){
                        return alert('must insert comment');
                    }
                    var xhr = new XMLHttpRequest();
                    xhr.onload = function() {
                        if(xhr.status === 200) {
                            console.log(xhr.responseText);
                            getComment(id);
                        }else{
                            console.error(xhr.responseText);
                        }
                    };

                    xhr.open('PATCH', '/comments/' + comment._id);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify({comment:newComment}));
                });
            
            var remove = document.createElement('button');
            remove.textContent = 'delete';
            remove.addEventListener('click', function(){//삭제 클릭시

                var xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    if(xhr.status === 200){
                        console.log(xhr.responseText);
                        getComment(id);
                    }else{
                        console.error(xhr.responseText);
                    }
                };
                xhr.open('DELETE','/comments/'+comment._id);
                xhr.send();
            });
            td = document.createElement('td');
            td.appendChild(edit);
            row.appendChild(td);
            td = document.createElement('td');
            td.appendChild(remove);
            row.appendChild(td);
            tbody.appendChild(row);
        });
        }else{
            console.error(xhr.responseText);
        }
    };

    xhr.open('GET','/comments/'+id);
    xhr.send();

}

//사용자 등록

document.getElementById('user-form').addEventListener('submit',function(e) {
    e.preventDefault();
    var name = e.target.username.value;
    var age = e.target.age.value;
    var married = e.target.married.checked;
    if(!name){
        return alert('write name');
    }
    if(!age){
        return alert('write age');
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 201){
            console.log(xhr.responseText);
            getUser();
        }else{
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST','/users');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({name:name,age:age,married:married}));
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.married.checked = false;
});

//댓글 등록시

document.getElementById('comment-form').addEventListener('submit',function(e){
    e.preventDefault();
    var userid = e.target.userid.value;
    var comment = e.target.comment.value;
    if(!userid){
        return alert('write id');
    }
    if(!comment){
        return alert('write comment');
    }

    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.status === 201){
            console.log(xhr.responseText);
            getUser();
        }else{
            console.error(xhr.responseText);
        }
    };
    xhr.open('POST','/comments');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({id:id, comment:comment}));
    e.target.userid.value = '';
    e.target.comment.value = '';
});
