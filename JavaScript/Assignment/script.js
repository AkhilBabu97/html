const addQuestion= document.getElementById('addQuestion');
const formdiv=document.getElementById('questionForm');
const save=document.getElementById('save');
const clear=document.getElementById('clear');
const texarea=document.querySelectorAll('textarea');
const category=document.getElementsByTagName('select');
const clsbtn=document.getElementById('font-btn');
const form=document.getElementById('questionAnswer');
const ulist=document.querySelector('.lists');





const arrqs=[];

function preventdef(e){
    e.preventDefault();
}

function closebtn(e){
    preventdef(e);
    clearButtonHandler();
    addButtonHandler();
}
 

function validateform(e){

    preventdef(e);
    const quest=texarea[0].value;
    const catg=category[0].value;
    const ansr=texarea[1].value;


    if (quest.trim()==''){
    alert('Enter valid question');
    return false;
   }

    if (ansr.trim()==''){
    alert('Enter valid question');
    return false;
    }

    if ( quest.length<10 ||  ansr.length<10){
        alert('Input less than 10 characters');
        return false;
    }
    if ((quest.trim()!=='' && quest.length>10) && (ansr.trim()!=='' && ansr.length>10)){
        const ques ={
            question: quest,
            questioncategory:catg,
            answer:ansr,
        };
        arrqs.push(ques);
        console.log(arrqs);
        addButtonHandler();
        clearButtonHandler();
        addlist(ques.question,ques.questioncategory,ques.answer);
    return false;
}
    return;
   
}

function addButtonHandler(){

    formdiv.classList.toggle('questionForm-visible');
}

function clearButtonHandler(){
    for(const texareas of texarea){
        texareas.value='';
    }   
}


const addlist=(questi,catgr,anser)=>{
    
    const newelm=document.createElement('div');
    newelm.className='div-item';
    newelm.innerHTML=`
    <li>
    <div class='list-div'>
    <h5>${catgr}</h5>
    <h2>${questi}</h2>
    <a href='' id='showNhide'> Show/Hide Answer</a><br>
    <h3 id='ansr' class='questionForm-invisible'>${anser}</h3><br>
    <button id="edit"> Edit</button>
    <button id="delete"> Delete</button>
    </div>
    </li>
    `;
    ulist.append(newelm);



}





function saveButtonHandler(){
    
    const quest=texarea[0].value;
    const catg=category[0].value;
    const ansr=texarea[1].value;
    
    if ((quest.trim()!=='' && quest.length>10) && (ansr.trim()!=='' && ansr.length>10)){
    const ques ={
        question: quest,
        questioncategory:catg,
        answer:ansr,
    };
    arrqs.push(ques);
    console.log(arrqs);
    addButtonHandler();
    clearButtonHandler();
    
}
}



addQuestion.addEventListener('click',addButtonHandler);

clsbtn.addEventListener('click',closebtn);

clear.addEventListener('click',clearButtonHandler);

save.addEventListener('click',validateform);