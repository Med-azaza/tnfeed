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
    const refreshFeed=()=>{
           document.getElementById('arrow').addEventListener('click',()=>{
       document.getElementById('dropMenu').classList.toggle('opened');
    });
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
        });
        

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
        post+=`<div class='post'><div class='post-head'><h3>${el.owner}</h3><span class='date'><abbr title="${fullDate}">${date}</span></div><div class='post-body'>${el.content}</div></div>`;
        feed.innerHTML=post;
    })
});
    submit.addEventListener('click',()=>{
        let content=document.getElementById('content').value;
        if (content!=''){
    let data={
        owner:userdata.name,
        content: `${content}`,
        date: Date.now()
    }
    document.getElementById('content').value='';
    fetch('https://tnfeed.herokuapp.com/post',{
        method:'POST',
        body:JSON.stringify(data),
        headers: {"Content-type": "application/json; charset=UTF-8"}
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