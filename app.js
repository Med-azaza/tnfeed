const authup=()=>{
    let submit=document.getElementById('submit');
    submit.addEventListener('click',(e)=>{
        e.preventDefault();
        let name=document.getElementById('name').value;
        let email=document.getElementById('email').value;
        let pass=document.getElementById('pass').value;
        if(name.length<6){
            alert('invalid name');
            return false;
        }
        if(email.indexOf('@')<0||email.length<6){
            alert('invalid email');
            return false;
        }
        if(pass.length<6){
            alert('password too short');
            return false;
        }
        let userdata={
            name:name,
            email:email,
            password:pass
        }
        fetch(`https://tnfeed.herokuapp.com/user/${email}`)
        .then(res=>res.json())
        .then((data)=>{
        if(data==null){
            fetch('https://tnfeed.herokuapp.com/register',{
                method:'POST',
                body:JSON.stringify(userdata),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .then(res=>res.json())
            .then((data)=>{
                alert('user registred successfully!! login to your account');
                fetch('../html/login.html')
                .then(res=>res.text())
                .then((data)=>{
                    document.getElementById('root').innerHTML=data;
                    authin();
                })
                .catch(err=>console.log(err));
            })
        }else{
            alert('user already registred');
        }
        });

});
}
const authin=()=>{
    let submit=document.getElementById('submit');
    submit.addEventListener('click',(e)=>{
    e.preventDefault();
    let email=document.getElementById('email').value;
    let pass=document.getElementById('pass').value;
    if(email.indexOf('@')<0||email.length<6){
        alert('invalid email');
        return false;
    }
    if(pass.length<6){
        alert('password too short');
        return false;
    }
        let userdata={
        email:email,
        password:pass
    }
    /*fetch(`https://tnfeed.herokuapp.com/user`,{
            headers: {"authorization":`bearer ${JSON.parse(localStorage.getItem('token')).token}`}
        })
    .then(res=>res.json())
    .then((data)=>{
        if(data!=null){*/
            document.getElementById('sign-card').innerHTML='<img src="img/Infinity-1s-200px.gif" alt="">';
        fetch('https://tnfeed.herokuapp.com/login',{
            method:'POST',
            body:JSON.stringify(userdata),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res=>res.json())
        .then((data)=>{
            if (data!=null){
            homepage(data.token);
            localStorage.setItem('token',JSON.stringify(data));
        }else{
                alert('wrong pass');
            }
        })
        //}else{
            //alert('email not registred');
        //}
        
    });

//});
}
const homepage=(token)=>{
    const openMenu=(e)=>{
        document.getElementById('dropMenu').classList.toggle('opened');
    }
    const refreshFeed=()=>{
        document.getElementById('arrow').removeEventListener('click',openMenu);
        document.getElementById('arrow').addEventListener('click',openMenu);
        document.getElementById('logout').addEventListener('click',()=>{
            localStorage.clear();
            location.reload();
        });
        let userdata={};
        const username=document.getElementById('username');
        const feed=document.querySelector('#posts');
        const submit=document.getElementById('submit');
        feed.innerHTML='<img src="img/Infinity-1s-200px.gif" alt="">';
        fetch('https://tnfeed.herokuapp.com/user',{
            headers: {"authorization":`bearer ${token}`}
        }).then(res=>res.json())
        .then((data)=>{
            userdata=data;
            username.innerHTML=userdata.name;
        }).then(()=>{
        fetch('https://tnfeed.herokuapp.com/posts',{
            headers: {"authorization":`bearer ${token}`}
        })
        .then(res=>res.json())
        .then((data)=>{
            let post='';
            if (data.length<1) {feed.innerHTML='no posts';}
            data.forEach((el)=>{
                let def=Date.now()-parseInt(el.date);
                let fullDate=new Date(parseInt(el.date));
                def=parseInt(def/1000);
                let date='';
                if(def<10){
                    date='now';
                }else if (def<60){
                    date=(def===1)?`${def} seconde ago`:`${def} seconds ago`
                }else if(def<3600){
                    def=parseInt(def/60);
                    date=(def===1)?`${def} minute ago`:`${def} minutes ago`
                }else if (def<86400){
                    def=parseInt((def/60)/60);
                    date=(def===1)?`${def} hour ago`:`${def} hours ago`
                }else{
                    def=parseInt(def/60/60/24);
                    date=(def===1)?`${def} day ago`:`${def} days ago`
                }
                let liked=false;
                for(let i in el.likers){
                    if(el.likers[i]===userdata._id){
                        liked=true;
                    }
                }
                let likeString=liked?'fas fa-heart':'far fa-heart';
                post+=`<div class='post' data-id="${el._id}">
                <div class='post-head'>
                <h3>${el.owner}</h3><span class='date'><abbr title="${fullDate}">${date}</span>
                </div>
                <div class='post-body'>${el.content}</div>
                <div class="post-foot"><i class="${likeString} like-button" data-like="${liked}"></i><span>${el.likers.length}</span><i class="far fa-comment-dots comment-button"></i><span>${el.comments.length}</span></div>
                </div>`;
                feed.innerHTML=post;
            })
            let likeButtons = document.querySelectorAll('.like-button');
            let comButtons = document.querySelectorAll('.comment-button');
            likeButtons.forEach((el)=>{
                el.addEventListener('click',(e)=>{
                    e.target.setAttribute('class','like-button');
                    e.target.innerHTML='<img src="img/Growing ring.gif" alt="">';
                    if(e.target.getAttribute('data-like')==='false'){
                        let data={
                            id:e.target.parentElement.parentElement.getAttribute('data-id'),
                        }
                        fetch('https://tnfeed.herokuapp.com/update_post/like',{
                            method:'POST',
                            body:JSON.stringify(data),
                            headers: {"Content-type": "application/json; charset=UTF-8","authorization":`bearer ${token}`}
                        }).then((res)=>{
                            e.target.setAttribute('class','fas fa-heart like-button');
                            e.target.setAttribute('data-like','true');
                            e.target.nextSibling.innerHTML=parseInt(e.target.nextSibling.textContent)+1;
                            e.target.innerHTML='';
                        })
                    }else{
                        let data={
                            id:e.target.parentElement.parentElement.getAttribute('data-id'),
                        }
                        fetch('https://tnfeed.herokuapp.com/update_post/unlike',{
                            method:'POST',
                            body:JSON.stringify(data),
                            headers: {"Content-type": "application/json; charset=UTF-8","authorization":`bearer ${token}`}
                        }).then((res)=>{
                            e.target.setAttribute('class','far fa-heart like-button');
                            e.target.setAttribute('data-like','false');
                            e.target.nextSibling.innerHTML=parseInt(e.target.nextSibling.textContent)-1;
                            e.target.innerHTML='';
                        })
                    }
                })
            });
            document.querySelector('.closeModal').addEventListener('click', () => {
                document.getElementById('commentsModal').setAttribute('class','');
            })
            const refreshComments = (data) => {
                document.querySelector('.comments').innerHTML = '<img src="img/Growing ring.gif" alt="">';
                        fetch('https://tnfeed.herokuapp.com/post/get_comments', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { "Content-type": "application/json; charset=UTF-8", "authorization": `bearer ${token}` }
                    }).then(res => res.json())
                        .then((comments) => {
                            comments = comments.comments;
                            let comsString = '';
                            if (comments.length === 0) {
                                comsString = 'No comments';
                            } else {
                                comments.forEach((el) => {
                                    comsString += `<div class='comment'><div>${el.owner}</div><div>${el.comment}</div></div>`
                                })
                            }
                            document.querySelector('.comments').innerHTML = comsString;
                        });
            }
            comButtons.forEach((el) => {
                el.addEventListener('click', (e) => {
                    document.getElementById('commentsModal').setAttribute('class', 'modalAppear');
                    document.getElementById('commentsModal').setAttribute('data-id', `${e.target.parentElement.parentElement.getAttribute('data-id')}`);
                    let data = {
                        id: e.target.parentElement.parentElement.getAttribute('data-id')
                    }
                    refreshComments(data);
                });
            });
            document.getElementById('submitComment').addEventListener('click', (e) => {
                if (document.getElementById('commentText').value !== '') {
                    let comment = document.getElementById('commentText').value;
                document.getElementById('commentText').value = '';
                let data = {
                    id: e.target.parentElement.parentElement.getAttribute('data-id'),
                    comment: comment
                };
                fetch('http://tnfeed.herokuapp.com/update_post/comment', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: { "Content-type": "application/json; charset=UTF-8", "authorization": `bearer ${token}` }
                })
                    .then((res) => {
                                            let data = {
                        id: e.target.parentElement.parentElement.getAttribute('data-id')
                    }
                        refreshComments(data);
                })

                }
            })
        })})
        submit.addEventListener('click',()=>{
            let content=document.getElementById('content').value;
            if (content!=''){
                let data={
                    owner:userdata.name,
                    content: `${content}`,
                    likes:[],
                    date: Date.now()
                }
                document.getElementById('content').value='';
                fetch('https://tnfeed.herokuapp.com/post',{
                    method:'POST',
                    body:JSON.stringify(data),
                    headers: {"Content-type": "application/json; charset=UTF-8","authorization":`bearer ${token}`}
                })
                .then(response =>{refreshFeed();});
            }});
    }
    fetch('../html/home.html')
    .then(res=>res.text())
    .then((data)=>{
        document.getElementById('root').innerHTML=data;
        refreshFeed();
    })
    .catch(err=>console.log(err));
}
if (localStorage.getItem('token')!==null){
    homepage(JSON.parse(localStorage.getItem('token')).token);
}else{
let signup=document.getElementById('signup');
let login=document.getElementById('login');

signup.addEventListener('click',()=>{
    fetch('../html/signup.html')
    .then(res=>res.text())
    .then((data)=>{
        document.getElementById('root').innerHTML=data;
        authup();
})
    .catch(err=>console.log(err));
});
login.addEventListener('click',()=>{
    fetch('../html/login.html')
    .then(res=>res.text())
    .then((data)=>{
        document.getElementById('root').innerHTML=data;
        authin();
})
    .catch(err=>console.log(err));
});}