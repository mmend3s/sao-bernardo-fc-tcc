const root=document.documentElement;
document.querySelector('#theme').addEventListener('click',()=>document.body.classList.toggle('dark'));
document.querySelector('#contrast').addEventListener('click',()=>document.body.classList.toggle('high-contrast'));
document.querySelector('#menu').addEventListener('click',()=>document.querySelector('#nav').classList.toggle('open'));
for(const link of document.querySelectorAll('a[href^="/"]')) link.addEventListener('click',e=>{if(link.getAttribute('href')!=='/'){e.preventDefault();document.querySelector('.news').scrollIntoView();history.pushState({},'',link.getAttribute('href'));}});

