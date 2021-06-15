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
    fetch(`https://tnfeed.herokuapp.com/user/${email}`)
    .then(res=>res.json())
    .then((data)=>{
        if(data!=null){
        fetch('https://tnfeed.herokuapp.com/login',{
            method:'POST',
            body:JSON.stringify(userdata),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(res=>res.json())
        .then((data)=>{
            if (data!=null){
            homepage(data);
            localStorage.setItem('data',JSON.stringify(data));
        }else{
                alert('wrong pass');
            }
        })
        }else{
            alert('email not registred');
        }
        
    });

});
}
const homepage=(userdata)=>{
    const refreshFeed=()=>{
        const username=document.getElementById('username');
        username.innerHTML=userdata.name
    const feed=document.querySelector('#posts');
     const submit=document.getElementById('submit');
        feed.innerHTML='<img src="img/Infinity-1s-200px.gif" alt="">';
        fetch('https://tnfeed.herokuapp.com/posts')
        .then(res=>res.json())
        .then((data)=>{
            let post='';
            if (data.length<1) {feed.innerHTML='no posts';}
        data.forEach((el)=>{
        post+=`<div class='post'><h5>${el.owner}</h5>${el.content}</div>`;
        feed.innerHTML=post;
    })
});
    submit.addEventListener('click',()=>{
        let content=document.getElementById('content').value;
        if (content!=''){
    let data={
        owner:userdata.name,
        content: `${content}`,
        date: `a day in life`
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
if (localStorage.getItem('data')!=null){
    homepage(JSON.parse(localStorage.getItem('data')));
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
});
}